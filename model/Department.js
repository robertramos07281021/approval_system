import mongoose from "mongoose";

const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true
    },
  }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;