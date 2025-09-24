import express from 'express'
import { CreateCompany, DeleteCompany, GetCompanyDetail, GetCompanyList, UpdateCompanyDetail } from '../controllers/company.controllers.js';
import { Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js';
import { createUpload } from '../middleware/multer.middleware.js';
const router = express.Router();

// router.post("/create",Is_Super_Admin,upload.single('company_logo'),CreateCompany)
// News uploads
router.post("/create",Is_Super_Admin, createUpload("company", {
        fileSize: 5 * 1024 * 1024, // 2MB
        allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
    }).single("company_logo"),
    CreateCompany
);


router.get("/list", GetCompanyList)
router.get("/detail/:id", GetCompanyDetail)
router.delete("/delete/:id", Is_Super_Admin, DeleteCompany)
router.patch("/update/:id", Is_Super_Admin, createUpload("company", {
    fileSize: 5 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).single("company_logo"), UpdateCompanyDetail)


export default router 