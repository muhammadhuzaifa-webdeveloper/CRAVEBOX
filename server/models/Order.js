import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, enum: ["online", "pos"], default: "online" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    orderType: { type: String, enum: ["Delivery", "Pickup", "Dine-in"], default: "Delivery" },
    paymentMethod: { type: String, enum: ["Cash", "Card"], default: "Cash" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        category: String,
        price: Number,
        quantity: { type: Number, default: 1, min: 1 },
        instructions: { type: String, default: "" },
      },
    ],
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

orderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `#ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
