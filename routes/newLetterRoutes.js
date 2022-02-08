import express from 'express'
const router = express.Router();

import {getNewsLetter, createNewsletter} from '../controllers/newsLetterController.js'

router.route("/").post(createNewsletter).get(getNewsLetter)

export default router