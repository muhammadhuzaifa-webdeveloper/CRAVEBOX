import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  address: u.address,
  role: u.role,
});

// Public signup always creates a "client". Admins are created via seed script.
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "This email is already registered" });
    }
    const user = await User.create({ name, email, password, phone, role: "client" });
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password || ""))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.status === "Inactive") {
      return res.status(403).json({ message: "This account is disabled" });
    }
    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is not registered as ${role}. Please choose the correct login type.` });
    }
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, address, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
      if (!(await user.matchPassword(currentPassword || ""))) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = newPassword;
    }
    await user.save();
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/me", protect, (req, res) => res.json({ user: publicUser(req.user) }));

export default router;
