import mongoose from "mongoose";
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        // enum: ["Administration", "Product", "Marketing","Operations"],
        trim: true,
      },
      manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
  }, { timestamps: true });
  
  const DEPARTMENT = mongoose.model("department", departmentSchema);
  
  export default DEPARTMENT;