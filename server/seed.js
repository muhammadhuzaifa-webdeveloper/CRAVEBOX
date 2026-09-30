import "dotenv/config";
import mongoose from "mongoose";
import { ensureSeed } from "./bootstrap.js";

await mongoose.connect(process.env.MONGO_URI);
await ensureSeed();
await mongoose.disconnect();
