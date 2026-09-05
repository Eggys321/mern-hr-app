import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema({
  leaveType: {
    type: String,
    enum: ["casual", "sick", "annual"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
  description: {
    type: String,
    trim: true,
  },
  appliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
}, { timestamps: true });

const LEAVE = mongoose.model("leave", leaveSchema);

export default LEAVE;
