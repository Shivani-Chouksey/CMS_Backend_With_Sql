import express from 'express'
import { getUserNotifications } from '../controllers/notification.controllers.js'

const router=express.Router()

// make that authenticated
router.get("/",getUserNotifications)


export default router
