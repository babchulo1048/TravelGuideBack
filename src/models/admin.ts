import mongoose, { Schema, Document } from "mongoose";

interface Admin extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const adminSchema = new Schema<Admin>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

const Admin = mongoose.model<Admin>("Admin", adminSchema);

export default Admin;
