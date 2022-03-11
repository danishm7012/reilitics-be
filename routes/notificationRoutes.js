import express from "express";
import {
  createNotification,
  getNotification,
} from "../controllers/notificationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, admin, createNotification);
router.route("/:_id").get(protect, getNotification);

export default router;
