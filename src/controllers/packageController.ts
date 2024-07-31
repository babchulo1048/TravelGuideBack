import { Request, Response } from "express";
import Package from "../models/package";
import Admin from "../models/admin";
import asyncMiddleware from "../middleware/async";
import fs from "fs";
import cloudinary from "../utils/cloudinary";

interface UpdateData {
  name: string;
  description: string;
  price: number;
  location: string;
  activities: string[];
  admin: string;
  itinerary: string[];
  image?: {
    public_id: string;
    url: string;
  };
}

class PackageController {
  createPackage = asyncMiddleware(async (req: Request, res: Response) => {
    const { name, description, price, location, activities, admin, itinerary } =
      req.body;

    const Admins = await Admin.findById(admin);
    if (!Admins) {
      return res.status(404).json({ error: "Admin not found" });
    }

    let image;

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      image = newPath;
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "packageImage",
    });

    const packages = new Package({
      name,
      description,
      price,
      location,
      activities,
      image: { public_id: result.public_id, url: result.secure_url },
      admin,
      itinerary,
    });
    await packages.save();
    res.status(201).json(packages);
  });

  detailPackage = asyncMiddleware(async (req: Request, res: Response) => {
    const packages = await Package.find();
    res.status(200).json(packages);
  });

  specificPackage = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;
    const singlePackage = await Package.findById(id);
    if (!singlePackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json(singlePackage);
  });

  updatePackage = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, location, activities, admin, itinerary } =
      req.body;

    console.log(
      name,
      description,
      price,
      location,
      activities,
      admin,
      itinerary
    );

    // const Admins = await Admin.findById(admin);
    // if (!Admins) {
    //   return res.status(404).json({ error: "Admin not found" });
    // }
    let image;

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      image = newPath;
      const result = await cloudinary.uploader.upload(image, {
        folder: "packageImage",
      });

      image = { public_id: result.public_id, url: result.secure_url };
    }

    const updateData: UpdateData = {
      name,
      description,
      price,
      location,
      activities,
      admin,
      itinerary,
    };

    if (image) {
      updateData.image = image;
    }

    const updatedPackage = await Package.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.status(200).json(updatedPackage);
  });

  deletePackage = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(204).end();
  });

  topRatedPackage = asyncMiddleware(async (req: Request, res: Response) => {
    const packages = await Package.find({ "ratings.0": { $exists: true } }); // Only find packages with at least one rating
    const ratedPackages = packages.filter((p) => p.ratings.length > 0); // Filter out packages with no ratings
    const topRatedPackages = ratedPackages
      .sort((a, b) => b.averageRating - a.averageRating) // Sort by average rating
      .slice(0, 3); // Get top 3 rated packages
    res.send(topRatedPackages);
  });
}

export default new PackageController();
