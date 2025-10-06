import { Op } from "sequelize";
import { db } from "../config/db-connection.js";

// ✅ Define globally (outside io.on) - In-memory map of connected users
const users = {}; // userId -> socket.id

function scoketHandler(io) {
    io.on('connection', (socket) => {
        console.log(`Socket Connected --->`, socket.id);


        // 🔐 Register user and map socket
        socket.on('register', async ({ userId }) => {
            console.log(`User registered: ${userId}`);
            socket.userId = userId;
            users[userId] = socket.id; // Save mapping
            console.log("users", users);
            console.log(" socket.userId", socket.userId);

            // 🔔 1. Fetch unread notifications 
            const unreadMessagesList = await db.notification.findAll({
                where: {
                    receiver_id: userId,
                    isRead: false
                },
                include: [{ model: db.messages, attributes: ["content", "read"], as: 'messageFromSendor' }, { model: db.appUser, attributes: ["role", "email"], as: 'senderInfo' }]
            });

            console.log("unreadMessagesList -----> ", unreadMessagesList);

            // 🔔 2. Emit each notification
            Array.isArray(unreadMessagesList).length && unreadMessagesList.forEach(element => {
                socket.emit('new_message', {
                    from: element.senderInfo,
                    message: element.messageFromSendor,

                })
            });
            // ✅ 3. Optionally mark as read

        });

        // 📩 Handle incoming message
        socket.on('send_message', async (data) => {
            try {
                const { receiver_id, message } = data;
                const targetSocketId = users[receiver_id];
                console.log("Target Socket ID:", targetSocketId);

                // ✅save message to db
                const currentMessage = await db.messages.create({ sender_id: socket.userId, receiver_id, content: message });

                if (targetSocketId) {
                    // ✅ User is online — send message directly
                    io.to(targetSocketId).emit('new_message', {
                        from: socket.userId,
                        message
                    });
                } else {
                    // ❌ User is offline — store notification
                    console.log(`User ${receiver_id} not connected`);
                    await db.notification.create({ receiver_id, message_id: currentMessage.id, type: 'new_message', sender_id: socket.userId })
                }
            } catch (error) {
                console.error("Error in send_message:", error);
            }
        });


        // Read Notification
        socket.on('mark_as_read', async ({ notificationIds }) => {
            // console.log('notificationIds',notificationIds);

            const notificationStatusChangeToRead = await db.notification.update(
                { isRead: true },
                {
                    where: {
                        id: { [Op.in]: notificationIds }
                    }
                });
            console.log("notificationStatusChangeToRead", notificationStatusChangeToRead);

        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (socket.userId) {
                delete users[socket.userId];
            }
        });
    });
}

export default scoketHandler