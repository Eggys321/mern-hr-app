import USER from "../models/userModel.js";
import { sendWelcomeEmail,sendForgotPasswordMail } from "../emails/emailHandlers.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import DEPARTMENT from "../models/departmentModel.js";

export const signup = async (req, res) => {
 
  
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({ success: false, errMsg: "Access denied. Admins only." });
  }
  const {
    firstName,
    lastName,
    mobileNumber,
    email,
    dateOfBirth,
    maritalStatus,
    gender,
    address,
    officeOfEmployment,
    jobTitle,
    department,
    employmentStatus,
    salary,
    startDate,
    password,
    confirmPassword,
  } = req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !email ||
      !dateOfBirth ||
      !maritalStatus ||
      !gender ||
      !address ||
      !officeOfEmployment ||
      !jobTitle ||
      !department ||
      !employmentStatus ||
      !salary ||
      !startDate ||
      !password ||
      !confirmPassword
    ) {
      res.status(400).json({
        success: false,
        errMsg: "all fields are required to register...",
      });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        errMsg: "password and confirm password must match",
      });
      return;
    }
    const existingEmail = await USER.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ success: false, errMsg: "Email already exists" });
      return;
    }
    const existingNumber = await USER.findOne({mobileNumber});
    if(existingNumber){
      res.status(400).json({ success: false, errMsg: "phone number already exists"});
      return;
    }
    const imageToBeUploaded = req.files?.profileImage?.tempFilePath || req.body.profileImage
    if(!imageToBeUploaded){
      return res.status(400).json({errMsg: 'image has to be uploaded', success: false})
    }

    const result = await cloudinary.uploader.upload(
      imageToBeUploaded,
      {
        use_filename: true,
        folder: "hr_manager",
      }
    );

    req.body.profileImage = result.secure_url;

    const dept = await DEPARTMENT.findOne({name: department})
    if (!dept) {
       return res.status(404).json({ success: false, errMsg: "Department not found." });
     }

     const newUser = await USER.create({ ...req.body, department: dept._id });

     dept.members.push(newUser._id);
      await dept.save();
    const clientUrl = process.env.CLIENT_URL;
 
     try {
       await sendWelcomeEmail({
         to: newUser.email,
         firstName: newUser.firstName,
         clientUrl,
       });
     } catch (emailError) {
       console.error("Error sending welcome email", emailError);
     }
 
     res.status(201).json({
       success: true,
       message: "Employee has been successfully added, and the department has been updated.",
       user: newUser,
     });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      errMsg: "all fields are required to sign in...",
    });
    return;
  }
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, errMsg: "Email or Password is Incorrect" });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, errMsg: "Email or Password is Incorrect" });
      return;
    }
    const token = await user.generateToken();
    if (token) {
      res.status(201).json({
        success: true,
        message: "logged in",
        user: {
          role: user.role,
          email: user.email,
          firstName:user.firstName,
          lastName:user.lastName,
          profileImage:user.profileImage,
          token,
        },
      });
      return;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  } 
};

export const forgotPassword = async(req,res)=>{
  const {email} = req.body;
  try {
    if(!email){
      res.status(400).json({success:false,errMsg:"input field can not be empty"});
      return;
    }
    const user = await USER.findOne({email});
    if(!user){
      res.status(200).json({ success: true, message: "If that email is registered, a reset link has been sent." });
      return
    }
    const resetToken = user.getResetPasswordToken()
    await user.save()
    const resetUrl = process.env.CLIENT_URL_RESET + resetToken;

    try {
      await sendForgotPasswordMail({
        to: user.email,
        firstName: user.firstName,
        resetUrl,
      })
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({success:false,errMsg:"Email couldn't be sent"})
    }
  } catch (error) {
    res.status(500).json({success:false,errMsg:error.message})
  }
};

 export const resetPassword = async (req,res)=>{
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
  try {
    const user = await USER.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
      return res.status(400).json({success:false,message:"invalid Reset Token"})
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(201).json({success:true,message:"Password Reset Successfull"})

  } catch (error) {
    res.status(500).json({success:false,errMsg:error.message})

  }
};

export const changePassword = async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ success: false, errMsg: "All fields are required" });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ success: false, errMsg: "New passwords do not match" });
  }

  try {
    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, errMsg: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, errMsg: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, errMsg: error.message });
  }
};

export const verify = async(req,res)=>{
  return res.status(201).json({success:true,user:req.user})
};
