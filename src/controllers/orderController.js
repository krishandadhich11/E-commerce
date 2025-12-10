import mongoose from "mongoose";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .session(session);
    if (!cart || cart.items.length === 0)
      throw Object.assign(new Error("Cart empty"), { statusCode: 400 });

    // check stock
    for (const it of cart.items) {
      const product = await Product.findById(it.product._id).session(session);
      if (product.inventory.quantity - product.inventory.reserved < it.qty) {
        throw Object.assign(
          new Error(`Insufficient stock for ${product.name}`),
          { statusCode: 400 }
        );
      }
    }

    // decrement real inventory and reserved (we assume reserved tracked earlier)
    for (const it of cart.items) {
      await Product.findByIdAndUpdate(
        it.product._id,
        {
          $inc: {
            "inventory.quantity": -it.qty,
            "inventory.reserved": -it.qty,
          },
        },
        { session }
      );
    }

    // create order record
    const items = cart.items.map((it) => ({
      product: it.product._id,
      qty: it.qty,
      priceAtPurchase: it.product.price,
    }));
    const total = items.reduce((s, i) => s + i.qty * i.priceAtPurchase, 0);

    const order = await Order.create(
      [
        {
          user: req.user._id,
          items,
          total,
          status: "paid",
        },
      ],
      { session }
    );

    // clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product"
  );
  res.json(orders);
};
