import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { paginate } from "../utils/pagination.js";

//  Dashboard – Sales Summary
export const salesSummary = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const revenueAgg = await Order.aggregate([
    { $match: { status: { $in: ["paid", "shipped", "completed"] } } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
    },
  });
};

//  Get All Orders with Pagination
export const ordersList = async (req, res) => {
  const { page, limit, skip } = paginate(req);

  const total = await Order.countDocuments();

  const orders = await Order.find()
    .populate("user")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    orders,
  });
};

//  Inventory Management with Pagination
export const inventoryList = async (req, res) => {
  const { page, limit, skip } = paginate(req);

  const total = await Product.countDocuments();

  const products = await Product.find()
    .select("name sku inventory")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products,
  });
};

//  Get Users List (Admin)
export const usersList = async (req, res) => {
  const { page, limit, skip } = paginate(req);

  const total = await User.countDocuments();

  const users = await User.find()
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    users,
  });
};
