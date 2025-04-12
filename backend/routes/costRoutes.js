// 📁 costRoutes.js
// 🛣️ API endpoint to handle POST request for cost estimation

import express from "express";
import { estimateCost } from "../controllers/costCalculator.js";

const router = express.Router();

console.log("it is working")

router.post("/estimate", estimateCost);

export default router;
