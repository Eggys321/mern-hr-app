import USER from "../models/userModel.js";
import { sendWelcomeEmail,sendForgotPasswordMail } from "../emails/emailHandlers.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import DEPARTMENT from "../models/departmentModel.js";

// sign-up
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
    //
    // if (!req.files || !req.files.profileImage) {
    //   return res
    //     .status(400)
    //     .json({ success: false, errMsg: "Profile image is required" });
    // }
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

    // fs.unlinkSync(req.files.profileImage.tempFilePath);
       const dept = await DEPARTMENT.findOne({name: department})
  console.log(dept);
    if (!dept) {
       return res.status(404).json({ success: false, errMsg: "Department not found." });
     }
     

     const newUser = await USER.create({ ...req.body, department: dept._id });

     // Find the department and add the new employee to the members array
  
  
     
    //  const dept = await DEPARTMENT.findOne({name: department})
     
   
 
     // Save the department with the new member
   dept.members.push(newUser._id); // Add new user's ID to the members array
      await dept.save();
    // Send a welcome email (optional)
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
 
     //Return the success response
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
// sign-in
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
    // finding a registered email address
    const user = await USER.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, errMsg: "user not found" });
      return;
    }
    // comparing password and validating password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res
        .status(404)
        .json({ success: false, errMsg: "Email or Password is Incorrect" });
      return;
    }
    // generating token

    const token = await user.generateToken();
    // console.log(token);
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

// forgot password
export const forgotPassword = async(req,res)=>{
  const {email} = req.body;
  try {
    if(!email){
      res.status(400).json({success:false,errMsg:"input field can not be empty"});
      return;
    }
    const user = await USER.findOne({email});
    if(!user){
      res.status(404).json({success:false,errMsg:"email not found"})
      return
    }
    const resetToken = user.getResetPasswordToken()
    await user.save()
    res.status(201).json({
      success: true,
      message: "mail sent",
    });
    const resetUrl = process.env.CLIENT_URL_RESET + resetToken;
   
    try {
      await sendForgotPasswordMail({
        to: user.email,
        firstName: user.firstName,
        resetUrl,
      })
      return
    } catch (error) {
      user.getResetPasswordToken = undefined;
      user.getResetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({errMsg:"Email couldnt be sent",error})
    }
  } catch (error) {
    res.json(error.message)
  }
}

 // reset password ftn
 export const resetPassword = async (req,res)=>{
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
  try {
    const user = await USER.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
      // resetPasswordExpire:{$gt:Date('2024-12-20')}

    })
    if(!user){
      return res.status(400).json({status:false,message:"invalid Reset Token"})
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(201).json({success:true,message:"Password Reset Successfull"})
    
  } catch (error) {
    res.status(500).json(error.message)
    
  }
}

// verify
export const verify = async(req,res)=>{
  return res.status(201).json({success:true,user:req.user})
}


