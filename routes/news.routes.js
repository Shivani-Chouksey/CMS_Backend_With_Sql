import express from 'express'
import { CreateNews, DeleteNews, GetAllNews, GetNewDetail, UpdateNewsDetail } from '../controllers/news.controllers.js'
import { Is_Super_Admin_or_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js';
import { Create_News_Req_Validator } from '../middleware/reqValidatores/news.validators.js';
const router = express.Router()


router.post("/create", Is_Super_Admin_or_Admin, upload.single('news_poster'), Create_News_Req_Validator, CreateNews);
router.get("/all", GetAllNews);
router.get("/detail/:title", GetNewDetail);
router.patch("/update/:id", Is_Super_Admin_or_Admin, upload.single('news_poster'), Create_News_Req_Validator, UpdateNewsDetail);
router.delete("/delete/:id",Is_Super_Admin_or_Admin,DeleteNews)

export default router