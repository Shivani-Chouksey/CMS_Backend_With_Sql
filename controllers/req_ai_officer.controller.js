import { db } from "../config/db-connection.js";
import { NotFound, ServerError, Success } from "../utils/response.js";
import { getSocketInstance } from "../utils/socketHandler.js";


export const ReqAiOfficer = async (req, res) => {
    try {
        const { company_req_id, user_id } = req.body;
        const CompanyReqDetail = await db.companyRequest.findByPk(company_req_id);
        console.log("CompanyReqDetail", CompanyReqDetail);
        if (!CompanyReqDetail) {
            return NotFound(res, "Company request not found");
        }
        CompanyReqDetail.ai_officer_req_inti = user_id;
        await CompanyReqDetail.save();
        //  Emit socket event to both users to start chat
        const io = getSocketInstance();
        const target_user_id = CompanyReqDetail.sender_id === user_id ? CompanyReqDetail.receiver_id : CompanyReqDetail.sender_id

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
        const { company_req_id, ai_officer_id, req_status, user_id } = req.body;
        const CompanyReqDetail = await db.companyRequest.findByPk(company_req_id);
        console.log("CompanyReqDetail", CompanyReqDetail);
        if (!CompanyReqDetail) {
            return NotFound(res, "Company request not found");
        }

        company_req_id.ai_officer_req_validator = user_id;
        company_req_id.ai_officer_req_status = req_status;
        // CompanyReqDetail.ai_officer_id = ai_officer_id;
        if (req_status === "accepted") {

        }
        await CompanyReqDetail.save();
        return Success(res, 'AI Officer Assigned Successfully');

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
                { model: db.appUser, as: 'requesterInfo', attributes: ['id', 'name', 'email'] },
                { model: db.appUser, as: 'approverInfo', attributes: ['id', 'name', 'email'] },
                { model: db.appUser, as: 'aiOfficerInfo', attributes: ['id', 'name', 'email'] },
                { model: db.company, as: 'companyInfo', attributes: ['id', 'name', 'logo_path'] }
            ]
        });

        return Success(res, updatedData, 'AI Officer Assigned to Request Successfully');
    } catch (error) {
        console.log('AssignAiOfficerToRequest', error);
        return ServerError(res, "Internal server error", error);
    }
}