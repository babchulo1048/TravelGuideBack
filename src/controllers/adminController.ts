import { Request, Response } from "express";
import Admin from "../models/admin";
import TourGuide from "../models/TourGuide";
import User from "../models/user";
import asyncMiddleware from "../middleware/async";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";

class AdminController {
  // Register Admin
  adminRegister = asyncMiddleware(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admins = await Admin.findOne({ email: email });
    if (admins) {
      return res
        .status(400)
        .json({ error: "User with this email already exist." });
    }

    // console.log("admins:", admins);

    const admin = new Admin({ name, email, password: hashedPassword });

    const result = await admin.save();

    const token = jwt.sign({ id: result._id }, config.JWT_SECRET, {
      expiresIn: config.EXPIREDIN,
    });

    res.status(201).json({ token, name: result.name, id: result._id });
  });

  //   Admin Login
  adminLogin = asyncMiddleware(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await Admin.findOne({ email });
    if (!user) {
      user = await TourGuide.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIREDIN,
    });

    res
      .status(200)
      .json({ token, name: user.name, role: user.role, id: user._id });
  });

  //   update TourGuide status

  updateTourGuideStatus = asyncMiddleware(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { status } = req.body;
      const tourGuide = await TourGuide.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!tourGuide)
        return res.status(404).json({ error: "Tour guide not found" });

      res.status(201).json(tourGuide);
    }
  );

  // update user status

  updateUserStatus = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(201).json(user);
  });
}

export default new AdminController();
