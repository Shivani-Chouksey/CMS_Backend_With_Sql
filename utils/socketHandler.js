import { Op } from "sequelize";
import { db } from "../config/db-connection.js";


// socketStore.js
let ioInstance = null;
export const users = {}; // userId -> socketId

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
    io.on('connection', (socket) => {
        console.log(`Socket Connected --->`, socket.id);

        socket.on('register', ({ userId }) => {
            socket.userId = userId;
            addUserSocket(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        socket.on('joined_room', (data) => {
            console.log("joined_room", data);
            socket.join(data.roomId);   
        })
   
        // Send message
        socket.on("send_message", async (data) => {
            try {
                const { roomId, message, requestId, receiverId } = data;
                if (!roomId || !message) {
                    console.warn("⚠️ Missing required fields in send_message");
                    return;
                }

                // Save message in DB
                const newMessage = await db.messages.create({
                    room_id: roomId.replace("room_", ""),
                    sender_id: socket.userId,
                    receiver_id: receiverId || null,
                    request_id: requestId,
                    content: message
                });

                // Broadcast to room
                io.to(roomId).emit("new_message", {
                    id: newMessage.id,
                    from: socket.userId,
                    message,
                    timestamp: newMessage.createdAt
                });

                console.log(`✅ Message sent in ${roomId} by ${socket.userId}`);
            } catch (error) {
                console.error("❌ Error in send_message:", error);
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
