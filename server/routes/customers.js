import { Router } from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(protect, allowRoles("admin"));

// Customers = users with role "client", plus order stats
router.get("/", async (_req, res) => {
  const [clients, stats] = await Promise.all([
    User.find({ role: "client" }).sort({ createdAt: -1 }),
    Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: "$user", orders: { $sum: 1 }, spent: { $sum: "$total" } } },
    ]),
  ]);
  const byUser = new Map(stats.map((s) => [String(s._id), s]));
  res.json(
    clients.map((c) => ({
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      status: c.status,
      orders: byUser.get(String(c._id))?.orders || 0,
      spent: byUser.get(String(c._id))?.spent || 0,
      joined: c.createdAt,
    }))
  );
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // Temporary password; the customer can be given access via password reset later
    const tempPassword = `Crave@${Math.floor(100000 + Math.random() * 900000)}`;
    const user = await User.create({ name, email, phone, status, password: tempPassword, role: "client" });
    res.status(201).json({ id: user._id, tempPassword });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "client" },
      { name, email, phone, status },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "Customer not found" });
    res.json({ id: user._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
