import USER from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { escapeRegex } from "../utils/escapeRegex.js";

const SELF_EDITABLE_FIELDS = [
  "firstName",
  "lastName",
  "mobileNumber",
  "address",
  "maritalStatus",
];
const ADMIN_EDITABLE_FIELDS = [
  ...SELF_EDITABLE_FIELDS,
  "email",
  "role",
  "salary",
  "jobTitle",
  "department",
  "employmentStatus",
  "officeOfEmployment",
  "gender",
  "dateOfBirth",
  "startDate",
];

function pickAllowedFields(source, allowedKeys) {
  const result = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = source[key];
    }
  }
  return result;
}

export const updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const isSelf = req.user.userId === employeeId;
  const isAdmin = ["admin", "super-admin"].includes(req.user.role);

  if (!isSelf && !isAdmin) {
    return res.status(403).json({
      success: false,
      errMsg: "You do not have permission to update this employee.",
    });
  }

  const allowedFields = isAdmin ? ADMIN_EDITABLE_FIELDS : SELF_EDITABLE_FIELDS;
  const updates = pickAllowedFields(req.body, allowedFields);
  if (
    Object.prototype.hasOwnProperty.call(updates, "role") &&
    updates.role === "super-admin" &&
    req.user.role !== "super-admin"
  ) {
    delete updates.role;
  }

  try {
    const imageToUpload = req.files?.profileImage?.tempFilePath;
    if (imageToUpload) {
      const result = await cloudinary.uploader.upload(imageToUpload, {
        use_filename: true,
        folder: "hr_manager",
      });
      updates.profileImage = result.secure_url;
    }

    const employee = await USER.findOneAndUpdate({ _id: employeeId }, updates, {
      new: true,
      runValidators: true,
    }).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!employee) {
      return res.status(404).json({ success: false, errMsg: "Employee not found." });
    }

    res.status(200).json({ success: true, message: "employee updated", employee });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, errMsg: error.message });
  }
};
export const employees = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
    
        const startIndex = (page - 1) * limit;
    
        const users = await USER.find()
        .populate({
          path: 'department',
          populate: {
            path: 'manager', 
            select: 'firstName lastName',
          },
        })
          .sort({ createdAt: -1 })
          .limit(limit)
          .select('-password -resetPasswordExpire -resetPasswordToken -createdAt -updatedAt')
          .skip(startIndex);
    
        const totalUsers = await USER.countDocuments();
    
        if (!users || users.length === 0) {
          return res.status(404).json({ success: false, errMsg: "No users found." });
        }
    
        res.status(200).json({
          success: true,
          count: users.length,
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          users,
        });

      } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, errMsg: "Server error." });
      }
};

export const searchUsers = async (req, res) => {
    const { query } = req.query;
    const safeQuery = escapeRegex(query);

    try {
      const users = await USER.find({
        $or: [
          {
            firstName: { $regex: safeQuery, $options: 'i' }
          },
          {
            lastName: { $regex: safeQuery, $options: 'i' }
          },
          {
            email: { $regex: safeQuery, $options: 'i' }
          },
        ]
      }).select('-password -resetPasswordToken -resetPasswordExpire');

      if (!users || users.length === 0) {
        return res.status(404).json({ success: false, errMsg: "No users found." });
      }

      res.status(200).json({
        success: true,
        count: users.length,
        users,
      });

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, errMsg: "Server error." });
    }
  };

export const getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
      const employee = await USER.findById(id)
        .populate('department')
        .select('-password -resetPasswordToken -resetPasswordExpire');

      if (!employee) {
        return res.status(404).json({ success: false, errMsg: "Employee not found." });
      }

      res.status(200).json({
        success: true,
        employee,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, errMsg: "Server error." });
    }
  };
export const getEmployeeProfile = async (req, res) => {
  const { userId } = req.user;

  try {
      const employee = await USER.findById(userId).select('firstName lastName email profileImage');

      if (!employee) {
          return res.status(404).json({ success: false, errMsg: "Employee not found." });
      }

      res.status(200).json({
          success: true,
          employee: {
              _id: employee._id,
              fullName: `${employee.firstName} ${employee.lastName}`,
              email: employee.email,
              profileImage: employee.profileImage,
          }
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, errMsg: "Server error." });
  }
};
