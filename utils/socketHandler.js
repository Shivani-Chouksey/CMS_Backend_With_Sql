import { Op } from "sequelize";
import { db } from "../config/db-connection.js";
import jwt from 'jsonwebtoken';


// socketStore.js
let ioInstance = null;
export const users = {}; // userId -> socketId
// utils/socketStore.js or inside SocketHandler file
export const getRoomParticipants = async (roomId) => {
    const companyReqId = roomId.replace('req_', '');
    console.log("parseInt(companyReqId)",parseInt(companyReqId),companyReqId);
    
    const participants = await db.companyRequest.findAll({
        where: { id:parseInt(companyReqId) }
    });
// console.log("participants",participants);

    if (!participants || participants.length === 0) return [];

    const userIds = [];
    participants.forEach(req => {
        if (req.requester_id) userIds.push(req.requester_id);
        if (req.approver_id) userIds.push(req.approver_id);
    });

    return userIds;
};
export const SetSocketInstance = (io) => {
    ioInstance = io
}

export const getSocketInstance = () => ioInstance;


export const addUserSocket = (userId, socketId) => {
    users[userId] = socketId;
}


export const removeUserSocket = (userId) => {
    delete users[userId];
};

export const getUserSocket = (userId) => users[userId];

export const getAllUserSockets = () => users;

function SocketHandler(io) {
    SetSocketInstance(io)

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        console.log("token inside socketHandler file ", socket.handshake, token);

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded in socket middleware", decoded);

            socket.user = decoded; // Attach user info to socket
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`Socket Connected --->`, socket.id);

        //Now  have authenticated user info
        console.log('Authenticated user:', socket.user);

        socket.on('register', async () => {
            const userId = socket.user.id; // from JWT
            socket.userId = userId;
            addUserSocket(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);

            // Send pending notifications
            const pendingNotifications = await db.notification.findAll({
                where: {
                    receiver_id: userId,
                    isRead: false,
                    status: { [Op.in]: ['pending', 'accepted'] },
                    type: { [Op.in]: ['company_request', 'chat_started'] }
                }
            });
            // const pendingNotifications = await db.notification.findAll({
            //     where: { receiver_id: userId, isRead: false, status: 'pending' }
            // });
            if (pendingNotifications.length > 0) {
                socket.emit('pending_notifications', pendingNotifications);
            }

        });


        // Handle chat accept
        socket.on('accept_chat', async (data) => {
            console.log("accpet_chat", data);

            const userId = socket.user.id;
            console.log(`accept_chat by user ${userId}`, data);

            const { company_req_id, req_id, chat_note_accept_status } = data
            console.log("company_req_id", company_req_id);

            const notif = await db.notification.findOne({ where: { company_req_id: company_req_id, company_req_id } });
            console.log(notif, "------------------");

            if (!notif) return;
            // Update notification status
            notif.status = 'accepted';
            notif.isRead = true;
            await notif.save();

            // Update companyRequest status
            const companyReq = await db.companyRequest.findByPk(notif.company_req_id);
            if (companyReq) {
                companyReq.status = 'chat_active';
                companyReq.approver_id = '1'
                await companyReq.save();
            }

            // Create chat room
            const roomId = `req_${notif.company_req_id}`;
            console.log("roomId", roomId);

            socket.join(roomId);

            // Check if sender is online
            const senderSocket = getUserSocket(notif.sender_id);
            console.log("senderSocket inside accept_chat", senderSocket);

            const initialMessage = await db.messages.findOne({
                where: { request_id: notif.company_req_id },
                order: [['createdAt', 'ASC']]
            });
            initialMessage.receiver_id = notif.receiver_id;
            initialMessage.room_id = roomId
            initialMessage.save();
            const chatStartPayload = {
                roomId,
                by: notif.receiver_id,
                initialMessage: {
                    content: initialMessage?.content || '',
                    sender_id: initialMessage?.sender_id,
                    timestamp: initialMessage?.createdAt
                }
            };

            if (senderSocket) {
                // Real-time notification
                io.to(senderSocket).emit('chat_started', chatStartPayload);
                io.sockets.sockets.get(senderSocket).join(roomId); // Add sender to room
            } else {
                // Sender offline → create a notification for them
                await db.notification.create({
                    receiver_id: notif.sender_id,
                    sender_id: notif.receiver_id,
                    type: 'chat_started',
                    company_req_id: notif.company_req_id,
                    status: 'pending',
                    isRead: false
                });
            }

            // Emit event to receiver (current user)
            socket.emit('chat_started', chatStartPayload);
        });

        socket.on('joined_room', ({ roomId }) => {
            console.log(`Socket ${socket.id} joined room ${roomId}`);
            socket.join(roomId);

            // Notify other users in the room
            socket.to(roomId).emit('user_joined', {
                userId: socket.id,
                message: `User ${socket.id} has joined the room.`
            });

        });

        // Reject chat
        socket.on('reject_chat', async ({ notificationId }) => {
            const notif = await db.notification.findByPk(notificationId);
            if (!notif) return;

            notif.status = 'rejected';
            notif.isRead = true;
            await notif.save();

            const senderSocket = getUserSocket(notif.sender_id);
            if (senderSocket) {
                io.to(senderSocket).emit('chat_rejected', { company_req_id: notif.company_req_id });
            }
        });

        socket.on('send_message', async (data) => {
            console.log('send_message data', data);

            try {
                const { roomId, content } = data;
                const sender_id = socket.userId;
                console.log(" socket.userId ----------- >", {
                    room_id: roomId,
                    sender_id,
                    content,
                });
                if (!roomId || !content) {
                    console.warn('Missing roomId or message');
                    return;
                }


                const companyReqId = roomId.replace('req_', '');
                // ✅ Save message to DB
                const currentMessage = await db.messages.create({
                    request_id: companyReqId,
                    room_id: roomId,
                    sender_id,
                    content,
                });

                const messagePayload = {
                    request_id: companyReqId,
                    room_id: roomId,
                    from: sender_id,
                    content,
                    timestamp: currentMessage.createdAt,
                    message_id: currentMessage.id,
                };

                // ✅ Emit to all users in the room
                socket.to(roomId).emit('new_message', messagePayload);

                // ✅ Optionally: notify offline users
                const roomParticipants = await getRoomParticipants(roomId); // Custom function
                console.log("roomParticipants",roomParticipants);
                
                for (const userId of roomParticipants) {
                    const targetSocketId = users[userId];
                    console.log("targetSocketId",targetSocketId);
                    
                    if (!targetSocketId) {
                        await db.notification.create({
                            receiver_id: userId,
                            sender_id,
                            message_id: currentMessage.id,
                            type: 'new_message',
                            status: 'pending',
                            isRead: false,
                        });
                    }
                    
                }
            } catch (error) {
                console.error('Error in send_message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (socket.userId) {
                removeUserSocket(socket.userId);
            }
        });

    })
}

export default SocketHandler
