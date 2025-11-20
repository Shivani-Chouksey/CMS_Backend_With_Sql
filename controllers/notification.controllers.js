import { db } from "../config/db-connection.js";
import { ServerError, Success } from "../utils/response.js";

export const getUserNotifications = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const allNotifications = await db.notification.findAll(
            {
                where: { receiver_id: currentUserId },
                include: [
                    {
                        model: db.messages,
                        as: 'messageFromSendor',
                        attributes: ['id', 'content', 'sender_id', 'receiver_id']
                    },
                    {
                        model: db.appUser,
                        as: 'senderInfo',
                        attributes: ['id', 'role', 'email']
                    },
                    {
                        model: db.companyRequest,
                        as: 'CompanyReqInfo',
                        attributes: ['id', 'company_id', 'message', 'expressed_interest', 'accept_req'],

                        include: [
                            {
                                model: db.company,
                                as: 'companyInfo', // assuming you have a relation to user
                                attributes: ['id', 'name', 'logo_path', 'content']
                            },
                        ]

                    }
                ]
            });
        console.log("allNotifications", allNotifications);

        // const incoming = allNotifications.filter(n => n.receiver_id === currentUserId);
        // const outgoing = allNotifications.filter(n => n.sender_id === currentUserId);
        // const pending = incoming.filter(n => !n.isRead); // pending = unread incoming

        return Success(res, allNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return ServerError(res, "Failed to fetch notifications", error);
    }
};