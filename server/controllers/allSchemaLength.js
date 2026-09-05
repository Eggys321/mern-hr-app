import DEPARTMENTS from "../models/departmentModel.js";
import USER from "../models/userModel.js";
import Task from "../models/taskModel.js";
import LEAVE from "../models/leaveModel.js";

export const allSchemaCount = async (req, res) => {
  try {
    const [usersCount, deptsCount, tasksCount, leaveCount] = await Promise.all([
      USER.countDocuments(),
      DEPARTMENTS.countDocuments(),
      Task.countDocuments(),
      LEAVE.countDocuments(),
    ]);

    const eventLenght = [
      { title: "Total Employees", count: usersCount },
      { title: "Total Tasks", count: tasksCount },
      { title: "Current Leaves", count: leaveCount },
    ];
    res.status(200).json({ success: true, eventLenght, usersCount, tasksCount, deptsCount, leaveCount });
  } catch (error) {
    res.status(500).json({ success: false, errMsg: error.message });
  }
};
