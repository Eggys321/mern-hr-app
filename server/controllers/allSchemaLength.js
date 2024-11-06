import DEPARTMENTS from "../models/departmentModel.js";
import USER from "../models/userModel.js";
import Task from "../models/taskModel.js";
import LEAVE from "../models/leaveModel.js";

export const allSchemaCount = async (req, res) => {
  try {
    const users = await USER.find();
    const depts = await DEPARTMENTS.find();
    const tasks = await Task.find();
    const leaves = await LEAVE.find();
    // counts
    const usersCount = users.length;
    const tasksCount = tasks.length;
    const leaveCount = leaves.length;

    const eventLenght =[
        {
            title:"Total Employees",
            count:users.length,
        },
        {
            title:"Total Tasks",
            count:tasks.length,
        },
        {
            title:"Current Leaves",
            count:leaveCount,
        }
    ] 
    res.status(200).json({ success: true, eventLenght,usersCount,tasksCount,leaves });
  } catch (error) {
    res.json(error);
  }
};
