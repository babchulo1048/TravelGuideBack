import express from "express";
import Routes from "./routes/indexRoutes";
import { connectToDatabase } from "./config/db";
import config from "./config";
import cors from "cors";

// import customerRoute from "./routes/customerRoute";

async function start() {
  try {
    // Connect to MongoDB using Mongoose

    const app = express();

    // Routes
    app.use(cors());
    app.use(express.json());
    app.use("/", Routes);

    // Start server
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });

    await connectToDatabase();
  } catch (error) {
    console.log(error);
  }
}

start();
