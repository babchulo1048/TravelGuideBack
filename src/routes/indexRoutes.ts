import errorHandler from "../middleware/error";
import express from "express";

import customerRoute from "./customerRoute";
import adminRoute from "./adminRoute";
import guideRoute from "./guideRoute";
import userRoute from "./userRoute";
import packageRoute from "./packageRoute";
import bookingRoute from "./bookingRoute";
import blogRoute from "./blogRoute";
import reviewRoute from "./reviewRoute";

const router = express.Router();

router.use("/customers", customerRoute);
router.use("/admin", adminRoute);
router.use("/guides", guideRoute);
router.use("/users", userRoute);
router.use("/packages", packageRoute);
router.use("/book", bookingRoute);
router.use("/blogs", blogRoute);
router.use("/reviews", reviewRoute);

router.use(errorHandler);

export default router;
