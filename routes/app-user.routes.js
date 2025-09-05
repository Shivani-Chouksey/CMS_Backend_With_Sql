import express from 'express'
import { Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
import { createUpload } from '../middleware/multer.middleware.js'
import { CreateAppUser, GetAllAppUser, GetAppUserDetail } from '../controllers/app-user.controllers.js'
const router = express.Router()

router.post('/create', Is_Super_Admin, createUpload("app-user", {
    fileSize: 5 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'identity_proof', maxCount: 1 },
    { name: 'address_proof', maxCount: 1 },
]), CreateAppUser)

router.get("/all",GetAllAppUser);
router.get("/detail/:id",GetAppUserDetail)

export default router