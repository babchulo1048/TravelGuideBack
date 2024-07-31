import { Request, Response } from "express";
import User from "../models/user";
import asyncMiddleware from "../middleware/async";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import TourGuide from "../models/TourGuide";

class UserController {
  // user detail
  userDetail = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

  // user register
  userRegister = asyncMiddleware(async (req: Request, res: Response) => {
    const { username, name, password, email, contactInformation } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const users = await User.findOne({ email: email });
    if (users) {
      return res
        .status(400)
        .json({ error: "User with this email already exist." });
    }

    let user = new User({
      username,
      name,
      password: hashedPassword,
      email,
      contactInformation,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIREDIN,
    });
    res.status(201).json({ user, token });
  });

  //userlogin
  userLogin = asyncMiddleware(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.status === "ban") {
      return res.status(403).json({
        error:
          "Your account has been banned. Please contact support for further assistance.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIREDIN,
    });

    res.status(200).json({ user, token });
  });

  // user update
  userUpdate = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, name, email, contactInformation } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        username,
        name,
        email,
        contactInformation,
      },
      { new: true }
    );
    res.status(200).json({ user });
  });

  //   Feth active users
  getActiveUsers = asyncMiddleware(async (req: Request, res: Response) => {
    const users = await User.find({ status: "active" });
    res.json(users);
  });

  //   Fetch banned users
  getBannedUsers = asyncMiddleware(async (req: Request, res: Response) => {
    const users = await User.find({ status: "ban" });
    res.json(users);
  });

  //   Rate Tour GUide
  rateGuide = asyncMiddleware(async (req: Request, res: Response) => {
    const { userId, guideId } = req.params;
    const { rating } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.send("user not found");

    let guide = await TourGuide.findById(guideId);
    if (!guide) return res.status(404).send("Guide not found");

    // Check if user has already rated the guide
    const existingRatingIndex = guide.ratings.findIndex(
      (r) => r.userId.toString() === userId
    );
    if (existingRatingIndex !== -1) {
      // Update existing rating
      guide.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      guide.ratings.push({ userId, rating });
    }

    // Calculate the average rating
    const totalRating = guide.ratings.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    guide.averageRating = totalRating / guide.ratings.length;

    await guide.save();

    res.send(guide);
  });
}

export default new UserController();
