import LEAVE from "../models/leaveModel.js";
import USER from "../models/userModel.js"
import { sendLeaveRequestMail, sendLeaveStatusUpdateMail } from "../emails/emailHandlers.js";
export const applyForLeave = async (req, res) => {
    const { leaveType, startDate, endDate, description } = req.body;
    if(!leaveType || !startDate ||!endDate || !description){
        res.status(400).json({success:false,errMsg:"all fields are required for leave application"})
        return;
    }
    const { userId,lastName,firstName } = req.user;  
  
    try {
      const newLeave = await LEAVE.create({
        leaveType,
        startDate,
        endDate,
        description,
        appliedBy: userId,
      });
  
      await USER.findByIdAndUpdate(userId, { $push: { leaves: newLeave._id } });
      const admins = await USER.find({ role: { $in: ["admin", "super-admin"] } });
      for (const admin of admins) {
          try {
            await sendLeaveRequestMail({
              to: admin.email,
              employeeName: `${req.user.firstName} ${req.user.lastName}`,
              leaveType,
              startDate,
              endDate,
              duration: calculateDuration(startDate, endDate),
              clientUrl: `${process.env.CLIENT_URL}/admin-dashboard/leaveboard`
          });
        } catch (emailError) {
          console.error(`Failed to notify admin ${admin.email} of new leave request:`, emailError);
        }
    }

    res.status(201).json({success:true,message:"Leave request sent,awaiting decision from admin.",newLeave});
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

export const approveLeave = async (req, res) => {
    const { leaveId } = req.params;
    const { userId } = req.user;  
  
    try {
      const leave = await LEAVE.findByIdAndUpdate(
        leaveId,
        { status: "approved", approvedBy: userId },
        { new: true }
      ).populate("appliedBy", "email firstName lastName _id");
  
      if (!leave) {
        return res.status(404).json({ error: "Leave request not found." });
      }
  
      const employee = leave.appliedBy;
      const duration = calculateDuration(leave.startDate, leave.endDate);

      try {
        await sendLeaveStatusUpdateMail({
          to: employee.email,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          duration,
          status: "approved",
          _id:leave._id
        });
      } catch (emailError) {
        console.error(`Failed to email ${employee.email} about leave approval:`, emailError);
      }

      res.status(200).json({success:true, message: `Leave request approved and notification sent to ${employee.email}.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


export const declineLeave = async (req, res) => {
    const { leaveId } = req.params;
    const { userId } = req.user;
  
    try {
      const leave = await LEAVE.findByIdAndUpdate(
        leaveId,
        { status: "declined", approvedBy: userId },
        { new: true }
      ).populate("appliedBy", "email firstName lastName");
  
      if (!leave) {
        return res.status(404).json({ error: "Leave request not found." });
      }
  
      const employee = leave.appliedBy;
      const duration = calculateDuration(leave.startDate, leave.endDate);

      try {
        await sendLeaveStatusUpdateMail({
          to: employee.email,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          duration,
          status: "declined",
        });
      } catch (emailError) {
        console.error(`Failed to email ${employee.email} about leave decline:`, emailError);
      }

      res.status(200).json({success:true, message: `Leave request declined and notification sent to ${employee.email}.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



export const getAllLeaves = async (req, res) => {
    try {
      const leaves = await LEAVE.find()
        .populate({
          path: "appliedBy",
          select: "firstName lastName profileImage", 
          model: USER,
        })
        .select("leaveType startDate endDate status _id"); 
  
      const formattedLeaves = leaves.map((leave) => ({
        fullName: `${leave.appliedBy.firstName} ${leave.appliedBy.lastName}`,
        profileImage: leave.appliedBy.profileImage,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        Days: calculateDuration(leave.startDate, leave.endDate),
        status: leave.status,
        _id:leave._id
      }));
      formattedLeaves.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0;
      });
        res.status(200).json({success:true,message:"all leaves",formattedLeaves});

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };





export const getSingleLeave = async (req, res) => {
    const { leaveId } = req.params;
    if (!leaveId) {
      return res.status(400).json({ error: "Leave ID is required." });
    }
  
    try {
      const leave = await LEAVE.findById(leaveId)
        .populate({
          path: "appliedBy",
          select: "firstName lastName profileImage email _id",
          model: USER,
        })
        .populate({
          path: "approvedBy",
          select: "firstName lastName _id",
          model: USER,
        })
        .select("leaveType startDate endDate description status approvedBy  leaveId"); 
  
      if (!leave) {
        return res.status(404).json({ error: "Leave request not found" });
      }
  
      const leaveDetails = {
        leaveId: leave._id,
        employee: leave.appliedBy
          ? {
              fullName: `${leave.appliedBy.firstName} ${leave.appliedBy.lastName}`,
              profileImage: leave.appliedBy.profileImage,
              email: leave.appliedBy.email,
              _id:leave.appliedBy._id
            }
          : null,  
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        duration: calculateDuration(leave.startDate, leave.endDate),
        description: leave.description,
        status: leave.status,
        
        approvedBy: leave.approvedBy
          ? `${leave.approvedBy.firstName} ${leave.approvedBy.lastName}`
          : "Not yet approved",  
      };
  
  
      res.status(200).json(leaveDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const getEmployeeLeaves = async (req, res) => {
    const { userId } = req.user; 
  
    try {
      const leaves = await LEAVE.find({ appliedBy: userId })
        .select("leaveType startDate endDate status")
        .lean()
        .sort({ createdAt: -1 })
  
      const leavesWithDays = leaves.map(leave => ({
        ...leave,
        Days: calculateDuration(leave.startDate, leave.endDate),
      }));
  
      res.status(200).json(leavesWithDays);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
function calculateDuration(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  return duration;
}
