import express from "express";
const router = express.Router();
import {
  createCategory,
  getCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
  getCategoryByStatus,
  deleteBulkCategories,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getCategories).post(protect, createCategory);
router
  .route("/status/:categoryStatus")
  .get(protect, admin, getCategoryByStatus);
router
  .route("/:id")
  .put(protect, admin, updateCategory)
  .get(getCategoryById)
  .delete(protect, admin, deleteCategory);

  router.route('/deleteBulk').post(admin,deleteBulkCategories)
export default router;
