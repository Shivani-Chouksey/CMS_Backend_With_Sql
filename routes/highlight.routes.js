import express from 'express'
import { CreateHighLight, DeleteHighLight, GetHighLightDetail, GetHighLightList, UpdateHighLight } from '../controllers/highlight.controllers.js'
import { Is_Logged_In, Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js'
const router = express.Router()

router.post("/create", Is_Super_Admin, CreateHighLight);
router.patch("/update/:id", Is_Super_Admin, UpdateHighLight);
router.delete("/delete/:id", Is_Super_Admin, DeleteHighLight);
router.get("/list", Is_Logged_In, GetHighLightList)
router.get("/detail/:id", Is_Logged_In, GetHighLightDetail)

export default router