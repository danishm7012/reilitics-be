import express from "express";
const router = express.Router();
import {
  createNote,
  getNotes,
  updateNote,
  getNoteById,
  deleteNote,
} from "../controllers/noteController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getNotes).post(protect, createNote);
router
  .route("/:id")
  .put(protect, updateNote)
  .get(getNoteById)
  .delete(protect, deleteNote);

export default router;
