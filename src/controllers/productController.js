import Product from "../models/Product.js";
import { paginate } from "../utils/pagination.js";

// Create Product (Admin only)
export const createProduct = async (req, res) => {
  const { name, description, price, sku, images, categories, inventory } =
    req.body;

  const product = await Product.create({
    name,
    description,
    price,
    sku,
    images,
    categories,
    inventory,
  });

  res.status(201).json(product);
};

//  Get All Products with Pagination
export const listProducts = async (req, res) => {
  const { page, limit, skip } = paginate(req);

  const total = await Product.countDocuments();

  const products = await Product.find()
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

//  Get Single Product by ID
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    product,
  });
};

// Update Full Product
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    product,
  });
};

//  Update only Inventory
export const updateInventory = async (req, res) => {
  const { quantity } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: { "inventory.quantity": quantity } },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    product,
  });
};

//  Delete Product
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
};
