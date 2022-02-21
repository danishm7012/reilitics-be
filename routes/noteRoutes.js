import express from 'express'
const router = express.Router()
import {
  createNote,
  getNotes,
  updateNote,
  getNoteById,
  deleteNote,
} from '../controllers/noteController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(protect, getNotes).post(protect, createNote)
router
<<<<<<< HEAD
  .route("/:id")
  .put(protect, updateNote)
  .get(getNoteById)
  .delete(protect, deleteNote);
=======
  .route('/:id')
  .put(protect, updateNote)
  .get(getNoteById)
  .delete(protect, deleteNote)
>>>>>>> 510a1187e9a42fe74c8ff17987a509fc3bb820d3

export default router
