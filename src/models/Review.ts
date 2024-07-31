import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface Review extends Document {
  user: ObjectId;

  text: String;
}

const reviewSchema = new Schema<Review>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model<Review>("Review", reviewSchema);

export default Review;
