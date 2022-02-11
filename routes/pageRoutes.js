import {
  getPage,
  createPage,
  updatePage,
  deletePageById,
  getPageById,
} from "../controllers/pageController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

router.route("/").post(protect, admin, createPage).get(protect, admin, getPage);
router
  .route("/:id")
  .put(protect, admin, updatePage)
  .get(protect, admin, getPageById)
  .delete(protect, admin, deletePageById);

export default router;
