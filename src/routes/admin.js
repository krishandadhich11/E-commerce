import express from "express";
import {
  inventoryList,
  salesSummary,
  ordersList,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();
router.use(protect, admin);
router.get("/inventory", inventoryList);
router.get("/sales-summary", salesSummary);
router.get("/orders", ordersList);
export default router;
