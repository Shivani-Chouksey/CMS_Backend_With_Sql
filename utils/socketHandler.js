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

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (socket.userId) {
                removeUserSocket(socket.userId);
            }
        });

    })
}

export default SocketHandler
