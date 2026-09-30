import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model("Product", productSchema);
