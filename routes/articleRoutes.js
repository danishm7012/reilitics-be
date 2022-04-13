import express from "express";
const router = express.Router();
import {
  getArticles,
  getArticleById,
  deleteArticle,
  createArticle,
  updateArticle,
  createArticleReview,
  getTopArticles,
  createBlogs,
  getArticlessbyPeriod,
  deleteBulkArticles,
} from "../controllers/articleController.js";
import { upload } from "../middleware/multer.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getArticles)
  .post(protect, admin, upload.single("image"), createArticle);
router.route("/:id/reviews").post(protect, createArticleReview);
router.get("/top", getTopArticles);
router.get("/blogs", createBlogs);
router.route("/byPeriod").post(getArticlessbyPeriod);

router.route("/deleteBulk").post(deleteBulkArticles);
router
  .route("/:id")
  .get(getArticleById)
  .delete(protect, admin, deleteArticle)
  .put(protect, admin, upload.single("image"), updateArticle);

export default router;
