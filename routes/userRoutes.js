import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  sendCode,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyCode,
  changePassword,
  changeAccountStatus,
  getAdmins,
  getEditors,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

router
  .route("/")
  .post(upload.single("image"), registerUser)
  .get(protect, admin, getUsers);
router.route("/admins").get(protect, admin, getAdmins);
router.route("/editors").get(protect, admin, getEditors);

router.post("/login", authUser);
router.post("/sendcode", sendCode);
router.post("/verifycode", verifyCode);
router.put("/changepassword", changePassword);
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
