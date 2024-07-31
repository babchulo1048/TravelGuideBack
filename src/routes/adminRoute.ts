import express from "express";
import adminController from "../controllers/adminController";

const router = express.Router();

router.post("/register", adminController.adminRegister);
router.post("/login", adminController.adminLogin);
router.put("/updateGuideStatus/:id", adminController.updateTourGuideStatus);

router.put("/updateUserStatus/:id", adminController.updateUserStatus);

export default router;
