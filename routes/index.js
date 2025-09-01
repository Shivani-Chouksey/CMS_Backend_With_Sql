import express from 'express';
import CMS_User_Routes from './cms-user.routes.js';
import NEWS_Routes from './news.routes.js'

const router=express.Router();


// All Routes
router.use('/cms-user',CMS_User_Routes);
router.use('/news',NEWS_Routes)


export default router;