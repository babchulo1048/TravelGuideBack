import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  username: string;
  email: string;
  name: string;
  contactInformation: string;
  status: string;
  isBooked: boolean;
  password: string;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    contactInformation: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    // Other fields as needed
  },
  { timestamps: true }
);

const User = mongoose.model<User>("User", userSchema);

export default User;
