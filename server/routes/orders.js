import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(protect);

const DELIVERY_FEE = 150;

// Client (online order) or Admin (POS bill). Prices always come from the database.
router.post("/", async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const { items = [], phone, address, customerName, paymentMethod, notes } = req.body;
    let { orderType = "Delivery" } = req.body;

    if (!items.length) return res.status(400).json({ message: "Cart is empty" });
    if (!["Delivery", "Pickup", "Dine-in"].includes(orderType)) orderType = "Delivery";
    if (!isAdmin && orderType === "Dine-in") orderType = "Pickup";
    if (orderType === "Delivery" && !isAdmin && !address?.trim()) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } });
    const map = new Map(products.map((p) => [String(p._id), p]));

    let subtotal = 0;
    const lines = [];
    for (const i of items) {
      const p = map.get(String(i.productId));
      if (!p) return res.status(400).json({ message: "An item in your cart is no longer on the menu. Please clear the cart and add it again." });
      const qty = Math.max(1, Number(i.quantity) || 1);
      subtotal += p.price * qty;
      lines.push({ product: p._id, title: p.title, category: p.category, price: p.price, quantity: qty, instructions: i.instructions || "" });
    }

    const deliveryFee = orderType === "Delivery" ? DELIVERY_FEE : 0;
    // Only admin (cashier) can apply a discount
    const discount = isAdmin ? Math.min(Math.max(Number(req.body.discount) || 0, 0), subtotal) : 0;

    const order = await Order.create({
      user: req.user._id,
      source: isAdmin ? "pos" : "online",
      customerName: customerName?.trim() || (isAdmin ? "Walk-in Customer" : req.user.name),
      customerEmail: isAdmin ? req.body.email || "" : req.user.email,
      phone: phone || (isAdmin ? "" : req.user.phone),
      address: address || "",
      orderType,
      paymentMethod: paymentMethod === "Card" ? "Card" : "Cash",
      items: lines,
      subtotal,
      deliveryFee,
      discount,
      total: subtotal + deliveryFee - discount,
      // POS counter bills are settled immediately; delivery bills go to the kitchen
      status: isAdmin ? (orderType === "Delivery" ? "Processing" : "Delivered") : "Pending",
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/mine", async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

router.get("/", allowRoles("admin"), async (_req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
});

router.patch("/:id/status", allowRoles("admin"), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", allowRoles("admin"), async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
