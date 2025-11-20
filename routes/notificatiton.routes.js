import express from 'express'
import { getUserNotifications } from '../controllers/notification.controllers.js'
import { Is_Logged_In } from '../middleware/jwt/check-cms-user-auth.middleware.js'

const router=express.Router()

// make that authenticated
router.get("/",Is_Logged_In,getUserNotifications)


export default router
