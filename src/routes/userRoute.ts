import express from "express";

import userController from "../controllers/userController";

const router = express.Router();

router.get("/active", userController.getActiveUsers);
router.get("/banned", userController.getBannedUsers);
router.get("/:id", userController.userDetail);
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.put("/:id", userController.userUpdate);
router.post("/:userId/:guideId", userController.rateGuide);

export default router;
