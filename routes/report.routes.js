import express from "express";
import { CreateReport, DeleteReport, GetReportDetail, GetReportList, UpdateReportDetail } from "../controllers/report.controllers.js";
import { createUpload } from "../middleware/multer.middleware.js";
import { Is_Logged_In, Is_Super_Admin } from "../middleware/jwt/check-cms-user-auth.middleware.js";
import { Report_Req_Validator } from "../middleware/reqValidatores/report.validators.js";
const router = express.Router();

router.post('/create', Is_Super_Admin, createUpload("report", {
    fileSize: 5 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).single("report_file"),Report_Req_Validator, CreateReport);

router.get("/list", Is_Logged_In, GetReportList);
router.get("/detail/:id", Is_Logged_In, GetReportDetail);
router.patch("/update/:id", Is_Super_Admin, createUpload("report", {
    fileSize: 5 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).single("report_file"), UpdateReportDetail)
router.delete("/delete/:id", DeleteReport);

export default router;