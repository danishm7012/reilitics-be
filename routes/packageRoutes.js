import express from "express";
const router = express.Router();
import {
  createPackage,
  getPackages,
  updatePackage,
  getPackageById,
  deletePackage,
} from "../controllers/packageController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getPackages)
  .post(protect, admin, createPackage)
  .put(protect, admin);
router
  .route("/:id")
  .put(protect, admin, updatePackage)
  .get(getPackageById)
  .delete(protect, admin, deletePackage);

export default router;
