import express from 'express'
import { CreateNews } from '../controllers/news.controllers.js'
import { Is_Super_Admin_or_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
const router =express.Router()


router.post("/",Is_Super_Admin_or_Admin,CreateNews)

export default router