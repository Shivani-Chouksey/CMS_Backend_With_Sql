import express from 'express';
import CMS_User_Routes from './cms-user.routes.js';
const router=express.Router();


// All Routes
router.use('/cms-user',CMS_User_Routes);


export default router;