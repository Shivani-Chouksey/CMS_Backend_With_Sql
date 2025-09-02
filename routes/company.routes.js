import express from 'express'
import { CreateCompany } from '../controllers/company.controllers.js';
import { Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
const router=express.Router();

router.post("/create",Is_Super_Admin,upload.single('company_logo'),CreateCompany)



export default router 