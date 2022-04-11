import express from 'express'
const router = express.Router()
import {
  createResource,
  getResources,
  updateResource,
  getResourceById,
  deleteResource,
  createData,
} from '../controllers/resourseController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/multer.js'

router
  .route('/')
  .get(getResources)
  .post(protect, admin, upload.single('file'), createResource)
router.get('/addmany', createData)
router
  .route('/:id')
  .put(protect, admin, upload.single('file'), updateResource)
  .get(getResourceById)
  .delete(protect, admin, deleteResource)

export default router
