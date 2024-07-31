// customer.model.ts
import mongoose, { Schema, Document } from "mongoose";

interface Customer extends Document {
  name: string;
}

const customerSchema = new Schema<Customer>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const CustomerModel = mongoose.model<Customer>("Customer", customerSchema);

export default CustomerModel;
