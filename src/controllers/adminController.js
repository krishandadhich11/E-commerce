import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const salesSummary = async (req, res) => {
  // total sales, orders count, top products
  const totals = await Order.aggregate([
    { $match: { status: { $in: ["paid", "shipped", "completed"] } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: { $multiply: ["$items.qty", "$items.priceAtPurchase"] },
        },
        orders: { $sum: 1 },
      },
    },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.product", qty: { $sum: "$items.qty" } } },
    { $sort: { qty: -1 } },
    { $limit: 5 },
  ]);

  res.json({ totals: totals[0] || { totalSales: 0, orders: 0 }, topProducts });
};

export const inventoryList = async (req, res) => {
  const products = await Product.find().select("name sku inventory");
  res.json(products);
};

export const ordersList = async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(orders);
};
