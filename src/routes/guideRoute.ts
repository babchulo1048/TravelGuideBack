import express from "express";
import guideController from "../controllers/guideController";

const router = express.Router();

router.get("/active", guideController.getActiveGuides);
router.get("/banned", guideController.getBannedGuides);
router.post("/register", guideController.guideRegister);
router.post("/login", guideController.guideLogin);

export default router;
