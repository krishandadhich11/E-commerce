import express from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  updateInventory,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.patch("/:id/inventory", protect, admin, updateInventory);
export default router;
