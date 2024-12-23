import express from "express";

import { authenticate, auhtorizeAdmin } from "../middlewares/authMiddleware.js";

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDeliver,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, auhtorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);

router.route('/total-orders').get(countTotalOrders)

router.route('/total-sales').get(calculateTotalSales)

router.route('/total-sales-by-date').get(calculateTotalSalesByDate)

router.route('/:id').get(authenticate, findOrderById)

router.route('/:id/pay').put(authenticate, markOrderAsPaid)

router.route('/:id/deliver').put(authenticate, auhtorizeAdmin, markOrderAsDeliver)

export default router;
