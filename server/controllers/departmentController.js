import DEPARTMENT from "../models/departmentModel.js";
import USER from "../models/userModel.js";

// Create Department
export const createDepartment = async (req, res) => {
  const { name, manager } = req.body;
  if (!name || !manager) {
    res.status(400).json({ success: false, errMsg: "all fields are required" });
    return;
  }

  try {
    const department = await DEPARTMENT.create({ name, manager });
    res
      .status(201)
      .json({ success: true, message: "Department created", department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// all depts
// export const getDepartments = async (req, res) => {
//   try {
//     const departments = await DEPARTMENT.find({}).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, departments });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching departments" });
//   }
// };
export const getDepartments = async (req, res) => {
  try {
    const departments = await DEPARTMENT.find({})
      .populate('manager', 'firstName lastName profileImage') 
      .populate('members', 'firstName lastName profileImage jobTitle status') 
      .sort({ createdAt: -1 });

    // If no departments are found
    if (!departments || departments.length === 0) {
      return res.status(404).json({ success: false, message: "No departments found." });
    }

    const formattedDepartments = departments.map(department => ({
      _id: department._id,
      name: department.name,
      membersLenght:department.members.length,
      manager: department.manager
        ? {
            _id: department.manager._id,
            fullName: `${department.manager.firstName} ${department.manager.lastName}`,
            profileImage: department.manager.profileImage,
          }
        : null,
      members: department.members.map(member => ({
        _id: member._id,
        fullName: `${member.firstName} ${member.lastName}`,
        profileImage: member.profileImage,
        jobTitle:member.jobTitle,
        status:member.status
      })),
    }));

    res.status(200).json({ success: true, departments: formattedDepartments });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching departments" });
  }
};

// single dept
export const getSingleDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await DEPARTMENT.findById(id)
      .populate({
        path: "members",
        select: "firstName lastName profileImage jobTitle employmentStatus",
      })
      .populate({
        path: "manager",
        select: "firstName lastName profileImage jobTitle employmentStatus",
      });

    // If the department is not found
    if (!department) {
      return res
        .status(404)
        .json({ success: false, errMsg: "Department not found." });
    }

    // Create a member array with the manager included
    const membersWithDetails = department.members.map((member) => ({
      fullName: `${member.firstName} ${member.lastName}`,
      profileImage: member.profileImage,
      jobTitle: member.jobTitle,
      status: member.employmentStatus,
    }));

    // Add the manager details to the members array
    if (department.manager) {
      membersWithDetails.push({
        fullName: `${department.manager.firstName} ${department.manager.lastName}`,
        profileImage: department.manager.profileImage,
        jobTitle: department.manager.jobTitle,
        status: department.manager.employmentStatus,
      });
    }

    // Return the department with member details
    res.status(200).json({
      success: true,
      department: {
        ...department.toObject(),
        members: membersWithDetails,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, errMsg: "Server error." });
  }
};

// search dept
export const searchDept = async (req, res) => {
  const { query } = req.query;

  try {
    // Use a regular expression to perform a case-insensitive search on dept name
    const dept = await DEPARTMENT.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Search by dept name
      ],
    });

    // If no users are found
    if (!dept || dept.length === 0) {
      return res.status(404).json({ success: false, errMsg: "No dept found." });
    }

    // Return the list of found users
    res.status(200).json({
      success: true,
      count: dept.length,
      dept,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, errMsg: "Server error." });
  }
};

// update dept
export const updateDept = async (req, res) => {
  const { deptId } = req.params;
  try {
    const department = await DEPARTMENT.findOneAndUpdate(
      { _id: deptId },
      req.body,
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ success: true, message: "dept updated", department });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};
