// config/db.ts
import mongoose from "mongoose";
import config from "./index";
export async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongodbURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
