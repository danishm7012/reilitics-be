import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  resendCode,
  codeVerification,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  changePassword,
  changeAccountStatus,
  getAdmins,
  getEditors,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.route("/admins").get(protect, admin, getAdmins);
router.route("/editors").get(protect, admin, getEditors);

router.post("/login", authUser);
// router.post("/checkpassword", protect, checkPassword);
router.put("/changepassword", protect, changePassword);
router.put("/code_verification", codeVerification);
router.put("/resend_code", resendCode);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/status/:id").put(protect, admin, changeAccountStatus);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
