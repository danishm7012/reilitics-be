import express from "express";
const router = express.Router();
import {
  createResource,
  getResources,
  updateResource,
  getResourceById,
  deleteResource,
} from "../controllers/resourseController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getResources).post(protect, admin, createResource);
router
  .route("/:id")
  .put(protect, admin, updateResource)
  .get(getResourceById)
  .delete(protect, admin, deleteResource);

export default router;
