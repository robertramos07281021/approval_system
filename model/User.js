import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      lowercase: true
    },
    type: {
      type: String,
      required: true,
      uppercase: true
    },
    department: {
      type: String,
      required: true,
      uppercase: true
    }, 
    branch: {
      type: String,
      required: true,
      uppercase: true
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;