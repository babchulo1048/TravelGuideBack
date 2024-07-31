import express from "express";
import bookingController from "../controllers/bookingController";

const router = express.Router();

router.get("/detail", bookingController.getBooking);
router.get("/user/:userId", bookingController.getBookingsByUser);
router.get("/package/:packageId", bookingController.getBookingsByPackage);
router.get("/guide/:id", bookingController.getBookingByGuide);
router.post("/create/:userId", bookingController.createBooking);
// router.post("/:bookingId/payment", bookingController.initializePayment);
router.post("/chapa/callback/:id", bookingController.checkOut);
router.put("/update/:bookingId", bookingController.updateBookingStatus);

router.delete("/delete/:bookingId", bookingController.deleteBooking);

export default router;
