import { Request, Response } from "express";
import Blog from "../models/Blog";
import asyncMiddleware from "../middleware/async";
import Package from "../models/package";
import User from "../models/user";

class BlogController {
  blogCreate = asyncMiddleware(async (req: Request, res: Response) => {
    const { userId, packageId, rating, comment } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const packages = await Package.findById(packageId);
    if (!packages) {
      return res.status(404).json({ error: "Package not found" });
    }

    const newBlog = new Blog({
      user: userId,
      packages: packageId,

      rating,
      comment,
    });
    await newBlog.save();

    // Add the rating to the package
    packages.ratings.push({ userId, rating });

    // Calculate the new average rating for the package
    const totalRating = packages.ratings.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    packages.averageRating = totalRating / packages.ratings.length;

    // Save the package
    await packages.save();

    // Populate the user field with only the name
    const populatedBlog = await newBlog.populate("user", "name");

    res.status(200).json(populatedBlog);
  });

  blogDetail = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = await Blog.find({ package: id }).populate({
      path: "user",
      select: "name", // Specify the field(s) you want to populate
    });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  });
}

export default new BlogController();
