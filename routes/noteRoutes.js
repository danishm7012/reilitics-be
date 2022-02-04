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

router.route("/").get(protect,getNotes).post(protect, admin, createNote);
router
  .route("/:id")
  .put(protect, admin, updateNote)
  .get(getNoteById)
  .delete(protect, admin, deleteNote);



export default router;