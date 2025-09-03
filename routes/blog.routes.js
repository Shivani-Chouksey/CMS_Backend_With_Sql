import express from 'express'
import { Is_Super_Admin_or_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
import { createUpload, upload } from '../middleware/multer.middleware.js';
import { CreateBlog, DeleteBlog, GetAllBlog, GetBlogDetail, UpdateBlogDetail } from '../controllers/blog.controllers.js';
const router = express.Router()


router.post("/create", Is_Super_Admin_or_Admin, createUpload("blog", {
    fileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).single("blog_poster"), CreateBlog);

router.get("/all", GetAllBlog);
router.get("/detail/:title", GetBlogDetail);
router.patch("/update/:id", Is_Super_Admin_or_Admin, upload.single('blog_poster'), UpdateBlogDetail);
router.delete("/delete/:id", Is_Super_Admin_or_Admin, DeleteBlog)

export default router