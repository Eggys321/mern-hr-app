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
      // Notify admins and super-admins
      const admins = await USER.find({ role: { $in: ["admin", "super-admin"] } });
      for (const admin of admins) {
          await sendLeaveRequestMail({
            to: admin.email,
            employeeName: `${req.user.firstName} ${req.user.lastName}`,
            leaveType,
            startDate,
            endDate,
            duration: calculateDuration(startDate, endDate),
            clientUrl: `http://localhost:5173/admin-dashboard/leaveboard`
        });
    }
    
    res.status(201).json({success:true,message:"Leave request sent,awaiting decision from admin.",newLeave});
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

export const approveOrDeclineLeave = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;
        const { userId,lastName,firstName } = req.user;  

  
    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'declined'." });
    }
  
    try {
      const leave = await LEAVE.findByIdAndUpdate(leaveId, { status,approvedBy: userId  }, { new: true }).populate("appliedBy","approvedBy");
  
      if (!leave) {
        return res.status(404).json({ error: "Leave request not found." });
      }
  
      const employee = leave.appliedBy;
      const duration = calculateDuration(leave.startDate, leave.endDate);
  
      // Send email notification to the employee
      await sendLeaveStatusUpdateMail({
        to: employee.email,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        duration,
        status,
      });
  
      res.status(200).json({ message: `Leave request ${status} and notification sent to ${employee.email}.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// approve
  export const approveLeave = async (req, res) => {
    const { leaveId } = req.params;
    const { userId } = req.user;  
  
    try {
      // Update the leave request status to approved
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
  
      // Send approval email to the employee
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
  
      res.status(200).json({ message: `Leave request approved and notification sent to ${employee.email}.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


//   decline
export const declineLeave = async (req, res) => {
    const { leaveId } = req.params;
    const { userId } = req.user;
  
    try {
      // Update the leave request status to declined
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
  
      // Send decline email to the employee
      await sendLeaveStatusUpdateMail({
        to: employee.email,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        duration,
        status: "declined",
      });
  
      res.status(200).json({ message: `Leave request declined and notification sent to ${employee.email}.` });
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
  
      // Map over leaves to add Days (duration) and format response
      const formattedLeaves = leaves.map((leave) => ({
        // 1
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
        return 0; // Maintain original order if statuses are the same
      });
        res.status(200).json({success:true,message:"all leaves",formattedLeaves});

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };





export const getSingleLeave = async (req, res) => {
    const { leaveId } = req.params;
  
    try {
      const leave = await LEAVE.findById(leaveId)
        .populate({
          path: "appliedBy",
          select: "firstName lastName profileImage email _id",
          model: USER,
        })
        .populate({
          path: "approvedBy",
          select: "firstName lastName",
          model: USER,
        })
        .select("leaveType startDate endDate description status approvedBy"); 
  
      if (!leave) {
        return res.status(404).json({ error: "Leave request not found" });
      }
  
      // Format response with duration included
      const leaveDetails = {
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

//   employee getting his leaves
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