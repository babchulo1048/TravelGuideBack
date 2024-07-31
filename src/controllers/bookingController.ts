import { Request, Response } from "express";
import asyncMiddleware from "../middleware/async";
import Booking from "../models/booking";
import User from "../models/user";
import Package from "../models/package";
import TourGuide from "../models/TourGuide";
// import Chapa from "chapa";
import { Chapa } from "chapa-nodejs";
import config from "../config";

// const chapa = new Chapa("YOUR_SECRET_KEY");

const chapaInstance = new Chapa({
  secretKey: config.chapa_secret,
});

class BookingController {
  createBooking = asyncMiddleware(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { packages, tourGuide, date, peopleNumber } = req.body;

    const users = await User.findById(userId);
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }

    const checkPackage = await Package.findById(packages);
    if (!checkPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    const tourGuides = await TourGuide.findById(tourGuide);
    if (!tourGuides) {
      return res.status(404).json({ error: "TourGuide not found" });
    }

    const newBooking = new Booking({
      user: userId,
      packages,
      tourGuide,
      date,
      peopleNumber,
    });

    await newBooking.save();

    // const tx_ref = `tx_${newBooking._id}_${Date.now()}`;
    const tx_ref = newBooking._id.toString();

    // Log the return URL to ensure it's correct
    console.log("Return URL:", config.return_url);
    console.log("Callback URL:", `${config.return_url}/${tx_ref}`);

    // Initialize payment with Chapa
    const paymentResponse = await chapaInstance.initialize({
      amount: checkPackage.price.toString(),
      currency: "ETB",
      email: users.email,
      first_name: users.name,
      last_name: users.name,
      tx_ref: tx_ref, // Unique transaction reference
      callback_url: `https://babiGuide.onrender.com/book/chapa/${tx_ref}`,
      // callback_url: "http://your-callback-url.com",
      // callback_url: "http://your-callback-url.com",
      return_url: "https://eyoeldemis.netlify.app",
      // return_url: `http://localhost:5173`, // Replace with your return URL
    });

    newBooking.paymentStatus = "initialized";
    await newBooking.save();

    res.status(201).json({
      booking: newBooking,
      paymentResponse,
      // paymentUrl: paymentResponse.checkoutUrl, // URL to redirect the user for payment
    });

    // Update the isBooked attribute for the tour guide and package
    // users.isBooked = true;
    // await users.save();

    // res.status(201).json(newBooking);
  });

  checkOut = asyncMiddleware(async (req: Request, res: Response) => {
    // res.json(req.body);
    const { id } = req.params;
    // const { tx_ref, status } = req.body;

    const chapaResponse = await chapaInstance.verify({
      tx_ref: id,
    });

    console.log("chapaResponse:", chapaResponse);

    // // Find the booking using the transaction reference
    const booking = await Booking.findOne({ tx_ref: id });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the booking payment status based on the callback status
    if (chapaResponse.data.status! == "success") {
      booking.paymentStatus = "successful";
    } else {
      booking.paymentStatus = "failed";
    }

    await booking.save();

    res.status(200).json({ message: "Payment status updated successfully" });
  });

  getBooking = asyncMiddleware(async (req: Request, res: Response) => {
    const bookings = await Booking.find().populate("user").populate("package");
    res.status(200).json(bookings);
  });

  getBookingsByUser = asyncMiddleware(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).populate("package");
    res.status(200).json(bookings);
  });

  getBookingsByPackage = asyncMiddleware(
    async (req: Request, res: Response) => {
      const { packageId } = req.params;
      const bookings = await Booking.find({ packages: packageId }).populate(
        "user"
      );
      res.status(200).json(bookings);
    }
  );

  getBookingByGuide = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;

    const guide = await TourGuide.findById(id);

    if (!guide) return res.status(404).send("TourGuide NOt Found");

    const bookings = await Booking.find({ tourGuide: id })
      .populate("user")
      .populate("package");
    res.status(200).json(bookings);
  });

  updateBookingStatus = asyncMiddleware(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  });

  deleteBooking = asyncMiddleware(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(204).end();
  });
}

export default new BookingController();
