import express from 'express'
import { Is_Logged_In_App_User, Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
import { createUpload } from '../middleware/multer.middleware.js'
import { AppUserLogin, CreateAppUser, GetAllAppUser, GetAppUserDetail, GetCurrentUser, UpdateAppUser, VerifyLoginOtp } from '../controllers/app-user.controllers.js'
import { app_user_req_validator } from '../middleware/reqValidatores/app-user.validators.js'
const router = express.Router()

router.post('/create', Is_Super_Admin, createUpload("app-user", {
    fileSize: 5 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'identity_proof', maxCount: 1 },
    { name: 'address_proof', maxCount: 1 },
]), app_user_req_validator, CreateAppUser)

router.get("/all", Is_Super_Admin,GetAllAppUser);
router.get("/detail/:id", GetAppUserDetail);
router.post("/login/otp", AppUserLogin);
router.post("/verify-otp", VerifyLoginOtp);
router.get("/current-user", Is_Logged_In_App_User, GetCurrentUser)

router.patch("/update/:id", Is_Super_Admin, createUpload("app-user", {
    fileSize: 5 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", 'application/pdf'],
}).fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'identity_proof', maxCount: 1 },
    { name: 'address_proof', maxCount: 1 },
]), UpdateAppUser)


export default router