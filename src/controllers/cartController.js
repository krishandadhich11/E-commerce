import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  res.json(cart || { user: req.user._id, items: [] });
};

// add/update item in cart and update reserved count on product
export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) existing.qty = qty;
  else cart.items.push({ product: productId, qty });
  await cart.save();

  // Update 'reserved' so inventory sync has better signal
  // Note: In heavy systems, this should be batched or event-sourced.
  const reservedCount = cart.items.reduce(
    (s, it) => s + (it.product.toString() === productId ? qty : 0),
    0
  );
  // simple approach: recompute across carts could be expensive; here we increment
  // For demo, increment reserved. In production, use more robust strategy.
  await Product.findByIdAndUpdate(productId, {
    $inc: { "inventory.reserved": qty },
  });

  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart empty" });
  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx === -1) return res.status(404).json({ message: "Item not in cart" });
  const removed = cart.items.splice(idx, 1)[0];
  await cart.save();
  await Product.findByIdAndUpdate(productId, {
    $inc: { "inventory.reserved": -removed.qty },
  });
  res.json(cart);
};
