import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface Package extends Document {
  name: string;
  description: string;
  price: number;
  location: string;
  activities: string[];
  image: {
    public_id: string;
    url: string;
  };
  admin: ObjectId;
  itinerary: { day: string; info: string }[];
  ratings: any[];
  averageRating: number;
}

const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number },
});

const PackageSchema = new Schema<Package>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    activities: { type: [String], required: true },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    itinerary: [{ day: { type: String }, info: { type: String } }],

    ratings: [RatingSchema],

    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Package = mongoose.model<Package>("Package", PackageSchema);

export default Package;
