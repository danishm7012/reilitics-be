import express from "express";
const router = express.Router();
import {
  getContacts,
  createContact,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(createContact).get(protect, admin, getContacts);

export default router;
