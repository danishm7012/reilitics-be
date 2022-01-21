import express from "express";
const router = express.Router();
import {
  createPackage,
  getPackages,
  updatePackage,
  getPackageById,
  deletePackage,
  updatePackageStatus,
  getFreeMembers,
  getMonthlyMembers,
  get24HourMembers,
} from "../controllers/packageController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getPackages).post(protect, createPackage);
router.route("/free-members").get(protect, admin, getFreeMembers);
router.route("/monthly-members").get(protect, admin, getMonthlyMembers);
router.route("/24hour-members").get(protect, admin, get24HourMembers);

router
  .route("/:id")
  .put(protect, admin, updatePackage)
  .get(getPackageById)
  .delete(protect, admin, deletePackage);
router.route("/status/:id").put(protect, updatePackageStatus);

export default router;
