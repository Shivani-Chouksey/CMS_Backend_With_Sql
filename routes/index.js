import express from 'express';
import CMS_User_Routes from './cms-user.routes.js';
import NEWS_Routes from './news.routes.js';
import COMPANY_Routes from './company.routes.js';
import BLOG_Routes from './blog.routes.js'
import App_User_Routes from './app-user.routes.js'
import Report_Routes from './report.routes.js';
import HIGHLIGHT_ROUTES from './highlight.routes.js';
import NOTIFICATIONSROUTES from './notificatiton.routes.js'
import { ApprovedAiOfficerReq, AssignAiOfficerToRequest, GetActiveReqChatHistory, ReqAiOfficer } from '../controllers/req_ai_officer.controller.js';
import { Is_Logged_In, Is_Super_Admin } from '../middleware/jwt/check-cms-user-auth.middleware.js';
const router = express.Router();


// All Routes
router.use('/cms-user', CMS_User_Routes);
router.use('/news', NEWS_Routes)
router.use("/company", COMPANY_Routes);
router.use("/blog", BLOG_Routes);
router.use("/app-user", App_User_Routes)
router.use("/report", Report_Routes)
router.use('/highlight', HIGHLIGHT_ROUTES)
router.use('/notifications',NOTIFICATIONSROUTES)
router.post("/req-ai-officer",Is_Logged_In,ReqAiOfficer);
router.post('/approve-ai-officer-req',Is_Logged_In,ApprovedAiOfficerReq);
router.post('/assign-ai-officer',Is_Super_Admin,AssignAiOfficerToRequest);
router.get('/activerequestchathistory/:company_Req_id',Is_Logged_In,GetActiveReqChatHistory)


export default router;