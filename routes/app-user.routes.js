import express from 'express'
import { Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
import { createUpload } from '../middleware/multer.middleware.js'
import { CreateAppUser } from '../controllers/app-user.controllers.js'
const router = express.Router()

router.post('/create', createUpload("company", {
    fileSize: 5 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).array('id_proof'), CreateAppUser)


export default router