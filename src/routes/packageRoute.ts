import express from "express";
import packageController from "../controllers/packageController";
import multer from "multer";
import path from "path";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Serve uploaded images
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.get("/", packageController.detailPackage);
router.get("/topRated", packageController.topRatedPackage);
router.get("/:id", packageController.specificPackage);
router.post("/create", upload.single("image"), packageController.createPackage);
router.put("/:id", upload.single("image"), packageController.updatePackage);

router.delete("/:id", packageController.deletePackage);

export default router;
