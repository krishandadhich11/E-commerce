import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const listProducts = async (req, res) => {
  const products = await Product.find().limit(100);
  res.json(products);
};

export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
};

export const updateInventory = async (req, res) => {
  const { quantity } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: { "inventory.quantity": quantity } },
    { new: true }
  );
  res.json(product);
};
