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
  checkPassword,
  changePassword,
  changeAccountStatus,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router.post("/checkpassword", protect, checkPassword);
router.put("/changepassword", protect, changePassword);
router.put("/code_verification", codeVerification);
router.put("/resend_code", resendCode);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);
router.route("/status/:id").put(protect, admin, changeAccountStatus);

export default router;
