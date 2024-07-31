import dotenv from "dotenv";

dotenv.config();

// console.log(process.env.MONGODB_URI);
const config = {
  mongodbURI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  EXPIREDIN: process.env.EXPIREDIN,
  PORT: process.env.PORT,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
  chapa_secret: process.env.CHAPA_API_KEY,
  return_url: process.env.return_url,
};

export default config;
