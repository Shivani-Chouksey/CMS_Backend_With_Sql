import express from 'express';
import CMS_User_Routes from './cms-user.routes.js';
import NEWS_Routes from './news.routes.js';
import COMPANY_Routes from './company.routes.js';
import BLOG_Routes from './blog.routes.js'


const router=express.Router();


// All Routes
router.use('/cms-user',CMS_User_Routes);
router.use('/news',NEWS_Routes)
router.use("/company",COMPANY_Routes);
router.use("/blog",BLOG_Routes)


export default router;