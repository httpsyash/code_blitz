import express from "express";
import { getSuggestions } from "../controllers/suggestionsController.js";

const router = express.Router();


router.post("/optimize", getSuggestions);

export default router;
