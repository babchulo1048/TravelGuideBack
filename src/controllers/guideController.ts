import { Request, Response } from "express";
import TourGuide from "../models/TourGuide";
import asyncMiddleware from "../middleware/async";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";

class GuideController {
  // TOurGuide Register
  guideRegister = asyncMiddleware(async (req: Request, res: Response) => {
    const { name, email, password, location, website, phone, description } =
      req.body;

    const tourGuide = await TourGuide.findOne({ email: email });

    if (tourGuide)
      return res.status(400).send("TourGuide with this email already exist.");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const guides = await TourGuide.findOne({ email: email });
    if (guides) {
      return res
        .status(400)
        .json({ error: "TourGuides with this email already exist." });
    }

    const guide = new TourGuide({
      name,
      email,
      password: hashedPassword,
      location,
      website,
      phone,
      description,
    });

    const result = await guide.save();

    const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIREDIN,
    });

    res.status(201).json({ result, name: result.name, token, id: result._id });
  });

  //   TourGUide Login

  guideLogin = asyncMiddleware(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user by email
    let user = await TourGuide.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // console.log("user.status", user.status);

    // Check if user is banned
    if (user.status === "ban") {
      return res.status(403).json({
        error:
          "Your account has been banned. Please contact support for further assistance.",
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIREDIN,
    });

    // Send user details and token
    res.status(200).json({ token, name: user.name, id: user._id });
  });

  //   Feth active guides
  getActiveGuides = asyncMiddleware(async (req: Request, res: Response) => {
    const guides = await TourGuide.find({ status: "active" });
    res.json(guides);
  });

  //   Fetch banned guides
  getBannedGuides = asyncMiddleware(async (req: Request, res: Response) => {
    const guides = await TourGuide.find({ status: "ban" });
    res.json(guides);
  });
}

export default new GuideController();
