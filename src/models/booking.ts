import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface Booking extends Document {
  user: ObjectId;
  packages: ObjectId;
  date: Date;
  peopleNumber: Number;
  tourGuide: ObjectId;
  status: String;
  // method:Number;
  isBooked: Boolean;
  paymentStatus?: String; // New field for payment reference
}

const BookingSchema = new Schema<Booking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    peopleNumber: {
      type: Number,
      required: true,
    },
    tourGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },

    status: {
      type: String,
      // enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    // method: {
    //   type: Number,
    //   default: 0,
    // },
    isBooked: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<Booking>("Booking", BookingSchema);

export default Booking;
