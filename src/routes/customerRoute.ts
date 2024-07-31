import express from "express";
import customerController from "../controllers/customerController";

const router = express.Router();

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.post("/", customerController.createCustomer);

export default router;
