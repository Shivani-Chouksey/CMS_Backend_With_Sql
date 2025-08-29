import express from "express";
import { CreateCMSUser } from "../controllers/cms-user.controllers.js";
const router = express.Router();


router.post("/", CreateCMSUser);


export default router;