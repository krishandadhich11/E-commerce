import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    images: [String],
    categories: [String],
    inventory: {
      quantity: { type: Number, default: 0 },
      reserved: { type: Number, default: 0 }, // items reserved in carts / pending orders
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
