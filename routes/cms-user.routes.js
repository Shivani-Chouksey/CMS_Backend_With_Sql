import express from "express";
import { CreateCmsAdmin, CreateCmsSuperAdmin, DeleteCmsUser, DropCmsuserTable, GetAllCMSUser, GetCurrentCmsUser, LoginCmsUser, UpdateCmsUser } from "../controllers/cms-user.controllers.js";
import { CmsAdminCustomReqValidator, CmsSuperAdminCustomReqValidator, UpdateCmsuserValidator } from "../middleware/reqValidatores/create-cms-user.validators.js";
import { Is_Logged_In, Is_Super_Admin } from "../middleware/jwt/check-cms-user-auth.middleware.js";
const router = express.Router();


router.post("/create-cms-super-admin", CmsSuperAdminCustomReqValidator, CreateCmsSuperAdmin);
router.post("/login", LoginCmsUser);
router.get("/all-cms-user",Is_Super_Admin, GetAllCMSUser);
router.post('/create-cms-admin', CmsAdminCustomReqValidator, Is_Super_Admin, CreateCmsAdmin)
router.delete("/drop/:id",Is_Super_Admin, DeleteCmsUser);
router.patch("/update/:id", UpdateCmsuserValidator, Is_Super_Admin, UpdateCmsUser);
router.get("/current-user",Is_Logged_In,GetCurrentCmsUser)

router.delete("/drop-table", DropCmsuserTable)


export default router;