import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface Blog extends Document {
  user: ObjectId;
  packages: ObjectId;
  rating: Number;
  comment: String;
  averageRating: Number;
}

const blogSchema = new Schema<Blog>(
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
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },

    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Blog = mongoose.model<Blog>("Blog", blogSchema);

export default Blog;
