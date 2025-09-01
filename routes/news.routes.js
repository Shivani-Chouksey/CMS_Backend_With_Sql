import express from 'express'
import { CreateNews, GetAllNews } from '../controllers/news.controllers.js'
import { Is_Super_Admin_or_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js';
const router =express.Router()


router.post("/create",Is_Super_Admin_or_Admin,upload.single('news_poster'),CreateNews);
router.get("/all",GetAllNews)

export default router