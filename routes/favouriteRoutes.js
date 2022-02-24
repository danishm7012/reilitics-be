import express from "express";
import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from "../controllers/favouriteController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(protect, addFavourite).get(protect, getFavourites);

router.route("/:id").delete(protect, removeFavourite);

export default router;
