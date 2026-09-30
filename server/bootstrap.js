import User from "./models/User.js";
import Product from "./models/Product.js";
import { products } from "../src/data/products.js";

// Runs on every server start. Creates the admin account and menu only if missing.
export async function ensureSeed() {
  const email = (process.env.ADMIN_EMAIL || "admin@cravebox.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  if (!(await User.findOne({ email }))) {
    await User.create({ name: process.env.ADMIN_NAME || "Store Admin", email, password, role: "admin" });
    console.log(`Admin account created -> ${email} / ${password}`);
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(
      products.map(({ title, description, price, category, image, rating }) => ({ title, description, price, category, image, rating }))
    );
    console.log(`Seeded ${products.length} menu items`);
  }
}
