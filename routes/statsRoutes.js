import express from "express";
const router = express.Router();
import {
  Test,
  createResource,
  getResources,
  updateResource,
  getResourceById,
  deleteResource,
  getRentalJson,
} from "../controllers/statsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/test").get(Test).post(protect, admin, createResource);
router.route("/rentaljson").get(getRentalJson).post(protect, admin, createResource);
router
  .route("/:id")
  .put(protect, admin, updateResource)
  .get(getResourceById)
  .delete(protect, admin, deleteResource);

export default router;
