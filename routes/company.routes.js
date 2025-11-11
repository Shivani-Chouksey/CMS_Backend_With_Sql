import express from 'express'
import { AcceptCompanyRequest, CompanyReq, CreateCompany, DeleteCompany, getAllCompanyRequest, GetCompanyDetail, GetCompanyList, UpdateCompanyDetail } from '../controllers/company.controllers.js';
import { Is_Logged_In, Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js';
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



router.post("/req",Is_Logged_In,CompanyReq);
router.post("/accept-request",AcceptCompanyRequest )
router.get('/req-list',Is_Logged_In,getAllCompanyRequest)
export default router 