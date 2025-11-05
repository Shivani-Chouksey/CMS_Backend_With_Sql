import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js"
import { Conflict, Created, NotFound, ServerError, Success } from "../utils/response.js"
import { getAllUserSockets, getSocketInstance, getUserSocket } from "../utils/socketHandler.js"

export const CreateCompany = async (req, res) => {
    try {
        const existingCompany = await db.company.findOne({ where: { name: req.body.name } })
        if (existingCompany) {
            await RemoveFile(req.file?.path)
            return Conflict(res, `Company Details Already Exist for name : ${req.body.name}`)
        }
        const reaponseData = await db.company.create({ ...req.body, logo_path: req.file?.path, created_by: req.user?.id })
        return Created(res, reaponseData, "Company Created")

    } catch (error) {
        await RemoveFile(req.file?.path)
        console.log("Create Company Error -->", error);
        if (error.name === 'SequelizeDatabaseError' || error.parent.code === 'ER_BAD_FIELD_ERROR') {
            return ServerError(res, 'Internal Server Error', error.original?.sqlMessage)
        }
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const GetCompanyList = async (req, res) => {
    try {
        let { limit, page } = req.query;

        // Convert to numbers if present
        limit = limit ? parseInt(limit) : null;
        page = page ? parseInt(page) : null;

        let queryOptions = {
            include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }]
        };

        if (limit && page) {
            const skip = (page - 1) * limit;
            queryOptions.limit = limit;
            queryOptions.offset = skip;
        }
        const responseData = await db.company.findAll(queryOptions);
        const totalRecordCount = await db.company.count();

        const pagination = limit && page
            ? {
                page,
                limit,
                totalRecord: totalRecordCount,
                totalPages: Math.ceil(totalRecordCount / limit)
            }
            : null;
        return Success(res, { data: responseData, pagination }, "All Company List")
    } catch (error) {
        console.log('GetCompanyList-->', error);
        if (error.name === 'SequelizeEagerLoadingError') {
            return ServerError(res, 'Internal Server Error', error)
        }
        return ServerError(res, 'Internal Server Error', error)

    }
}

export const GetCompanyDetail = async (req, res) => {
    try {
        const { id } = req.params
        const responseData = await db.company.findOne({ where: { id }, include: [{ model: db.cmsUser, attributes: ['id', 'role', 'userName'] }] })
        if (!responseData || responseData === null || responseData === undefined) {
            return NotFound(res, `Detail Not Exist for ID ${id}`)
        }
        return Success(res, responseData, "Company Detail")
    } catch (error) {
        console.log('GetCompanyDetail-->', error);
        return ServerError(res, 'Internal Server Error', error)

    }
}

export const UpdateCompanyDetail = async (req, res) => {
    try {
        console.log(req.body, req.file);
        const { id } = req.params;
        const existingCompany = await db.company.findOne({ where: { id } });
        if (existingCompany === null) {
            await RemoveFile(req.file?.path)
            return NotFound(res, `Company Not Exist with Id  : ${id}`)
        }
        if (req.file?.path && existingCompany?.logo_path) {
            await RemoveFile(existingCompany?.logo_path)
            existingCompany.logo_path = req.file?.path
        }
        existingCompany.content = req.body?.content
        existingCompany.save();
        const responseData = await db.company.findOne({ where: { id }, include: [{ model: db.cmsUser, attributes: ['id', 'role', 'userName'] }] })
        return Success(res, responseData, "Company Detail Updated")
    }
    catch (error) {
        console.log(error);
        await RemoveFile(req.file?.path)
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const DeleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCompany = await db.company.findOne({ where: { id } });
        if (existingCompany === null) {
            await RemoveFile(req.file?.path)
            return NotFound(res, `Company Not Exist with Id  : ${id}`)
        }
        await RemoveFile(existingCompany.logo_path)
        await db.company.destroy({ where: { id } })
        return Success(res, null, `Company Deleted Id : ${id}`)
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const CompanyReq = async (req, res) => {
    try {
        console.log("req data --->", req.body);
        const { requester_id, expressed_interest, message, company_id } = req.body
        const requestData = await db.companyRequest.create(req.body);

        // Step 2: Store the initial message
        const messageResponse = await db.messages.create({
            sender_id: requester_id,
            receiver_id: null, // will be filled when someone accepts
            request_id: requestData.id,
            content: message
        });

        // Step 3: Get all users in the company except the requester
        const userList = await db.userCompanyTransaction.findAll({ where: { company_id } });
        console.log("userList userCompanyTransaction---------> ", userList);

        // Filter out the user who made the request
        const filteredUsers = userList.filter(user => user.buyer_id !== requester_id);
        console.log("filteredUsers ----------->", filteredUsers);

        // const notifications = filteredUsers.map(user => ({
        //     receiver_id: user.buyer_id,
        //     sender_id: requester_id,
        //     type: "company_request",
        //     message_id: messageReponse.id,
        //     isRead: false,
        //     company_req_id: requestData.id

        // }))

        let notifications = [];
        if (filteredUsers.length > 0) {
            notifications = filteredUsers.map(user => ({
                receiver_id: user.buyer_id,
                sender_id: requester_id,
                type: "company_request",
                message_id: messageResponse.id,
                isRead: false,
                company_req_id: requestData.id
            }));
        } else {
            // No other user hold this company in portfolio → notify company creator
            const company = await db.company.findByPk(company_id);
            if (company && company.created_by !== requester_id) {
                notifications.push({
                    receiver_id: company.created_by,
                    sender_id: requester_id,
                    type: "company_request",
                    message_id: messageResponse.id,
                    isRead: false,
                    company_req_id: requestData.id
                });
            }
        }

        console.log("notifications -------> ", notifications);

        const fullRequestData = await db.companyRequest.findOne({
            where: { id: requestData.id },
            include: [
                {
                    model: db.appUser,
                    as: 'requesterInfo', // use correct alias if defined in associations
                    attributes: ['id', 'role', 'email']
                },
                {
                    model: db.appUser,
                    as: 'approverInfo', // use correct alias if defined in associations
                    attributes: ['id', 'role', 'email']
                },
                {
                    model: db.company,
                    as: 'companyInfo', // assuming you have a relation to user
                    attributes: ['id', 'name', 'logo_path', 'content']
                },
                // Add other related models as needed
            ]
        });
        if (notifications.length > 0) {
            await db.notification.bulkCreate(notifications);
            const io = getSocketInstance();

            filteredUsers.forEach(user => {
                const users = getAllUserSockets()
                console.log("users --> ", users);
                // console.log("user", user);

                const targetSocketId = users[user.buyer_id]; // from socketHandler
                console.log("targetSocketId --> ", targetSocketId);

                if (targetSocketId) {
                    io.to(targetSocketId).emit('company_request_notification', {
                        type: 'company_request',
                        from: requester_id,
                        data: fullRequestData // send full request data
                    });
                }
            });

        }

        return Created(res, fullRequestData, "Company Request Created")
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const getAllCompanyRequest = async (req, res) => {
    try {
        // const userId=req.user.id
        const userId = 1
        const reponseData = await db.companyRequest.findAll();
        const incomingReq = reponseData.filter((req) => req.user_id != userId);
        const outgoingReq = reponseData.filter((req) => req.user_id === userId)
        const pendingReq = reponseData.filter((req) => req.user_id === userId && req.accept_req === null)
        return Success(res, { incomingReq, outgoingReq, pendingReq }, "Compnay Reques List");
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error);
    }
}


export const AcceptCompanyRequest = async (req, res) => {
    try {
        const { company_req_id, accept_req, notification_id } = req.body;
        const receiver_id = 1;
        // const receiver_id = req.user.id;
        const request = await db.companyRequest.findByPk(company_req_id);
        if (!request) {
            return NotFound(res, "Company request not found");
        }

        const sender_id = request.requester_id;

        if (accept_req === true) {
            // Step 1: Update request status
            await db.companyRequest.update(
                { accept_req },
                { where: { id: company_req_id } }
            );

            // await db.notification.update({ isRead: true }, { where: { id: notification_id } })
            // Step 2: Remove the notification
            // await db.notification.destroy({ where: { id: notification_id } });

            // Step 3: Update the initial message with receiver_id
            await db.messages.update(
                { receiver_id },
                {
                    where: {
                        request_id: company_req_id,
                        receiver_id: null
                    }
                }
            );

            // Step 4: Emit socket event to both users to start chat
            const io = getSocketInstance();
            const senderSocket = getUserSocket(sender_id);
            const receiverSocket = getUserSocket(receiver_id);

            const roomId = `room_${company_req_id}`; // Unique room ID based on request
            console.log("roomId", roomId);

            const payload = {
                roomId,
                requestId: company_req_id,
                senderId: sender_id,
                receiverId: receiver_id,
                message: "Chat room created"
            };
            console.log("Socket Payload ---> ", payload);
            console.log("senderSocket -->", senderSocket);
            console.log("receiverSocket -->", receiverSocket);

            if (senderSocket) {
                io.to(senderSocket).emit("chat_room_created", payload);
            }

            if (receiverSocket) {
                io.to(receiverSocket).emit("chat_room_created", payload);
            }

            return Success(res, "Request accepted and chat enabled");
        } else {
            // Declined: remove the request
            // await db.companyRequest.destroy({ where: { id: company_req_id } });

            return Success(res, "Request declined and removed");
        }

    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error);
    }
};