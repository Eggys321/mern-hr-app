import USER from "../models/userModel.js";
// update employee
export const updateEmployee = async(req,res)=>{
    const {employeeId} = req.params;
    try {
        const employee = await USER.findOneAndUpdate(
            {_id:employeeId},
            req.body,
            {new:true,runValidators:true}
        )
        res.status(200).json({success:true,message:"employee updated",employee})
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}
// all employees
export const employees = async(req,res)=>{
    try {
        // Set default values for page and limit
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
    
        // Calculate the starting index of the page
        const startIndex = (page - 1) * limit;
    
        // Fetch users with pagination and populate the department field
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
    
        // Get total number of users for pagination
        const totalUsers = await USER.countDocuments();
    
        // If no users are found
        if (!users || users.length === 0) {
          return res.status(404).json({ success: false, errMsg: "No users found." });
        }
    
        // Return the paginated list of users with total count
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
    // try {
    //     const users = await USER.find().populate('department');
    //     const userLenght = users.length;
    //     res.status(200).json({
    //         userLenght,
    //         success: true,
    //         data: users,
    //       });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ success: false, errMsg: "Server error" });
    // }
}

// search employees
export const searchUsers = async (req, res) => {
    const { query } = req.query; // Get the search query from query parameters
  
    try {
      // Use a regular expression to perform a case-insensitive search on name or email
      const users = await USER.find({
        $or: [
          { firstName: { $regex: query, $options: 'i' } }, // Search by first name
          { lastName: { $regex: query, $options: 'i' } }, // Search by last name
          { email: { $regex: query, $options: 'i' } },    // Search by email
        ]
      });
  
      // If no users are found
      if (!users || users.length === 0) {
        return res.status(404).json({ success: false, errMsg: "No users found." });
      }
  
      // Return the list of found users
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

//   single employee
export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the employee using the ID
      const employee = await USER.findById(id).populate('department');
  
      // If no employee is found
      if (!employee) {
        return res.status(404).json({ success: false, errMsg: "Employee not found." });
      }
  
      // Return the employee data
      res.status(200).json({
        success: true,
        employee,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, errMsg: "Server error." });
    }
  };


  // Get Employee Profile for employees
export const getEmployeeProfile = async (req, res) => {
  const { userId } = req.user; 

  try {
      const employee = await USER.findById({ _id: userId}).select('firstName lastName email profileImage password');

      if (!employee) {
          return res.status(404).json({ success: false, errMsg: "Employee not found." });
      }

      res.status(200).json({
          success: true,
          employee: {
              fullName: `${employee.firstName} ${employee.lastName}`,
              email: employee.email,
              profileImage: employee.profileImage,
              password:employee.password
          }
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, errMsg: "Server error." });
  }
};






 