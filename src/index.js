import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "express-async-errors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import adminRoutes from "./routes/admin.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
app.use(express.json());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev")); //Morgan logs information about every request that comes.
// Run Morgan logging only in development, not in production.

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("E-commerce API"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`Server running on ${PORT}`))
);
