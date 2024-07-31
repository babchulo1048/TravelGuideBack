import mongoose, { Schema, Document } from "mongoose";

interface TourGuide extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  location: string;
  description: string;
  website: string;
  phone: string;
  ratings: any[];
  averageRating: number;
}

const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number },
});

const guideSchema = new Schema<TourGuide>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    role: { type: String, default: "TourGuide" },
    // Other operator specific properties
    status: {
      type: String,
      default: "active",
    },
    ratings: [RatingSchema],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TourGuide = mongoose.model<TourGuide>("TourGuide", guideSchema);

export default TourGuide;
