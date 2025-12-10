import express from "express";
import {
  salesSummary,
  ordersList,
  inventoryList,
  usersList,
} from "../controllers/adminController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);

router.get("/dashboard", salesSummary);
router.get("/orders", ordersList);
router.get("/inventory", inventoryList);
router.get("/users", usersList);

export default router;
