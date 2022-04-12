import express from "express";
const router = express.Router();
import {
  getContacts,
  createContact,
  deleteBulkContacts,
  getContactsbyPeriod,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(createContact).get(protect,admin, getContacts);

router.route('/deleteBulk').post(deleteBulkContacts)

router.route('/byPeriod').post(getContactsbyPeriod)

export default router;
