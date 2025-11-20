import { where } from "sequelize";
import { db } from "../config/db-connection.js";
import { NotFound, ServerError, Success } from "../utils/response.js";
import { getAllUserSockets, getSocketInstance } from "../utils/socketHandler.js";


export const ReqAiOfficer = async (req, res) => {
    try {
        const user_id = req.user.id
        const { company_req_id } = req.body;
        const CompanyReqDetail = await db.companyRequest.findByPk(company_req_id);
        console.log("CompanyReqDetail", CompanyReqDetail);
        if (!CompanyReqDetail) {
            return NotFound(res, "Company request not found");
        }
        CompanyReqDetail.ai_officer_req_inti = user_id;
        await CompanyReqDetail.save();
        //  Emit socket event to both users to start chat
        const io = getSocketInstance();
        const target_user_id = CompanyReqDetail.requester_id === user_id ? CompanyReqDetail.receiver_id : CompanyReqDetail.requester_id
        const users = getAllUserSockets()
        const targetSocketId = users[target_user_id]; // from socketHandler
        console.log("targetSocketId --> ", targetSocketId);

        if (targetSocketId) {
            io.to(targetSocketId).emit('ai_officer_req_intilaized', {
                from: user_id,
                data: CompanyReqDetail
            });
        } else {
            console.log(`User ${target_user_id} not connected`);
            await db.notification.create({ receiver_id: target_user_id, company_req_id: company_req_id, type: 'ai_officer_req_intilaized', sender_id: user_id })
        }
        return Success(res, 'Req Intilized');
    } catch (error) {
        console.log('ReqAiOfficer', error);
        return ServerError(res, "Internal server error", error);
    }
}

export const ApprovedAiOfficerReq = async (req, res) => {
    try {
        const user_id = req.user.id
        const { company_req_id, req_status } = req.body;
        const CompanyReqDetail = await db.companyRequest.findByPk(company_req_id);
        if (!CompanyReqDetail) {
            return NotFound(res, "Company request not found");
        }

        CompanyReqDetail.ai_officer_req_validator = user_id;
        CompanyReqDetail.ai_officer_req_status = req_status;
        // CompanyReqDetail.ai_officer_id = ai_officer_id;
        if (req_status === "accepted") {
            CompanyReqDetail.ai_officer_req_approval_status = 'pending';
            await CompanyReqDetail.save();
            await db.notification.create({ receiver_id: CompanyReqDetail.ai_officer_id, company_req_id: CompanyReqDetail.id, type: 'ai_officer_req_approval', sender_id: user_id })
            const users = getAllUserSockets()
            const io = getSocketInstance();
            const targetSocketId = users[CompanyReqDetail.ai_officer_id]; // from socketHandler
            console.log("targetSocketId --> ", targetSocketId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('ai_officer_req_approval', {
                    from: user_id,
                    data: CompanyReqDetail
                });
            }
            return Success(res, 'Request initialized and AI Officer notified');
        }
        if (req_status === "rejected") {
            await CompanyReqDetail.save();

            // Notify requester about rejection
            await createNotification({
                receiver_id: CompanyReqDetail.requester_id,
                company_req_id: CompanyReqDetail.id,
                type: 'ai_officer_req_rejected',
                sender_id: user_id
            });
            return Success(res, 'Request rejected and requester notified');
        }
        await CompanyReqDetail.save();
        return Success(res, 'Status updated successfully');


    } catch (error) {
        console.log('ApprovedAiOfficerReq', error);
        return ServerError(res, "Internal server error", error);
    }
}


export const AssignAiOfficerToRequest = async (req, res) => {
    try {
        const { company_req_id, ai_officer_id } = req.body;
        console.log("company_req_id, ai_officer_id -->", company_req_id, ai_officer_id);
        const companyReqInfo = await db.companyRequest.findByPk(company_req_id);
        if (!companyReqInfo) {
            return NotFound(res, "Company request not found");
        }
        companyReqInfo.ai_officer_id = ai_officer_id;
        companyReqInfo.ai_officer_assigned_by = req.user.id;
        companyReqInfo.ai_officer_assigned_at = new Date();

        await companyReqInfo.save();

        // Fetch updated data with associations
        const updatedData = await db.companyRequest.findOne({
            where: { id: company_req_id },
            include: [
                { model: db.appUser, as: 'requesterInfo', attributes: ['id', 'email'] },
                { model: db.appUser, as: 'approverInfo', attributes: ['id', 'email'] },
                { model: db.cmsUser, as: 'aiOfficerInfo', attributes: ['id', 'email'] },
                { model: db.company, as: 'companyInfo', attributes: ['id', 'name', 'logo_path'] }
            ]
        });

        return Success(res, updatedData, 'AI Officer Assigned to Request Successfully');
    } catch (error) {
        console.log('AssignAiOfficerToRequest', error);
        return ServerError(res, "Internal server error", error);
    }
}


export const GetActiveReqChatHistory = async (req, res) => {
    try {
        const { company_Req_id } = req.params;
        const resData = await db.messages.findAll({ where: { request_id: company_Req_id } });
        return Success(res, resData)
    } catch (error) {
        console.log('GetActiveReqChatHistory', error);
        return ServerError(res, "Internal server error", error);
    }
}