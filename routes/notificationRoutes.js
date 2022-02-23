import express from 'express'
import { createNotification, getNotification } from '../controllers/notificationController.js'
import {protect}  from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect,createNotification).get(protect,getNotification)




export default router