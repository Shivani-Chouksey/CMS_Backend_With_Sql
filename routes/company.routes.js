import express from 'express'
import { CreateCompany } from '../controllers/company.controllers.js';
import { Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js';
import { createUpload, upload } from '../middleware/multer.middleware.js';
const router = express.Router();

// router.post("/create",Is_Super_Admin,upload.single('company_logo'),CreateCompany)
// News uploads
router.post(
    "/create",
    // Is_Super_Admin,
    createUpload("company", {
        fileSize: 5 * 1024 * 1024, // 2MB
        allowedTypes: ["image/jpeg", "image/png",'application/pdf'],
    }).single("company_logo"),
    CreateCompany
);


export default router 