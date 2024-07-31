import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import config from "../config";

dotenv.config();

console.log("process.env.CLOUD_NAME:", process.env.CLOUD_NAME);

cloudinary.config({
  cloud_name: config.cloud_name as string,
  api_key: config.api_key as string,
  api_secret: config.api_secret as string,
});

export default cloudinary;
