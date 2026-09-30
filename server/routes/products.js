import { Router } from "express";
import Product from "../models/Product.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await Product.find().sort({ createdAt: -1 }));
});

router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

router.post("/", protect, allowRoles("admin"), async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", protect, allowRoles("admin"), async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, allowRoles("admin"), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
