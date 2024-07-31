// customer.controller.ts
import { Request, Response } from "express";
import CustomerModel from "../models/customer";
import asyncMiddleware from "../middleware/async";

class CustomerController {
  getAllCustomers = asyncMiddleware(async (req: Request, res: Response) => {
    const customers = await CustomerModel.find();
    res.json(customers);
  });

  getCustomerById = asyncMiddleware(async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer = await CustomerModel.findById(id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  });

  createCustomer = asyncMiddleware(async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Please provide a name" });
    }

    const newCustomer = await CustomerModel.create({ name });
    res.status(201).json(newCustomer);
  });
}

export default new CustomerController();
