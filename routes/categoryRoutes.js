import express from 'express'
const router = express.Router()
import {
  createCategory,
  getCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
  getCategoryByStatus,
  deleteBulkCategories,
} from '../controllers/categoryController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route("/").get(getCategories).post(protect, createCategory);
router.route('/deleteBulk').post(deleteBulkCategories)
router
  .route('/:id')
  .put(protect, admin, updateCategory)
  .get(getCategoryById)
  .delete(protect, admin, deleteCategory)

 
export default router;
