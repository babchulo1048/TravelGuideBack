import express from "express";
import blogController from "../controllers/blogController";

const router = express.Router();

router.get("/", blogController.blogDetail);
router.post("/create", blogController.blogCreate);

export default router;
