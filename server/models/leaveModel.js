// import mongoose from "mongoose";

// const leaveSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ["annual", "sick", "casual"],
//     required: true,
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   daysRequested: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "declined"],
//     default: "pending",
//   },
//   approvedBy: {
//     adminId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     fullName: String,
//     date: Date,
//   },
// }, { timestamps: true } );

// const LEAVE = mongoose.model("Leave", leaveSchema);

// export default LEAVE;

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
