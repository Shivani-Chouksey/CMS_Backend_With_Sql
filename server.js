import express from 'express';
import 'dotenv/config';
import All_API_Routes from './routes/index.js';
import { db, DbConnection } from './config/db-connection.js';
import morgan from 'morgan';
import path from 'node:path';
import fs from 'node:fs';
import { apiSpecification } from './config/swagger-docs.js';
import swaggerUi from 'swagger-ui-express'
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import scoketHandler from './utils/socket.js';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: "*" });
app.use(express.json());

// ensure log directory exists
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
}

//create a write stream 
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: 'a' });

//setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'))

// console.log(JSON.stringify(apiSpecification, null, 2));
//swagger config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpecification));


app.get('/api/v1/health-check', (req, res) => {
    res.send('CMS Backend With SQL Running');
});


// All Routes
app.use('/api/v1', All_API_Routes);





// ✅ Socket.io Logic
// io.on('connection', (socket) => {

//     // ✅ In-memory map of connected users
//     const users = {}; // userId -> socket.id
//     console.log(`Socket Connected --->`, socket.id);


//     // 🔐 Register user and map socket
//     socket.on('register', async (userId) => {
//         console.log(`User registered: ${userId}`);
//         socket.userId = userId;
//         users[userId] = socket.id; // Save mapping
//         console.log("users", users);
//         console.log(" socket.userId", socket.userId);

//         // 🔔 1. Fetch unread notifications 
//         const unreadMessagesList = await db.notification.findAll({
//             where: {
//                 receiver_id: userId,
//                 isRead: false
//             }
//         });

//         console.log("unreadMessagesList -----> ", unreadMessagesList);

//         // 🔔 2. Emit each notification
//         Array.isArray(unreadMessagesList).length && unreadMessagesList.forEach(element => {
//             socket.emit('new_message', {
//                 from: element.sender_id,
//                 message: element.message_id,

//             })
//         });
//         // ✅ 3. Optionally mark as read


//         // await connection.end();

//     });

//     // 📩 Handle incoming message
//     socket.on('send_message', async (data) => {
//         try {
//             const { receiver_id, message } = data;
//             const targetSocketId = users[receiver_id];
//             console.log("Target Socket ID:", targetSocketId);

//             // ✅save message to db
//             const currentMessage = await db.messages.create({ sender_id: socket.userId, receiver_id, content: message });

//             if (targetSocketId) {
//                 // ✅ User is online — send message directly
//                 io.to(targetSocketId).emit('new_message', {
//                     from: socket.userId,
//                     message
//                 });
//             } else {
//                 // ❌ User is offline — store notification
//                 console.log(`User ${receiver_id} not connected`);
//                 await db.notification.create({ receiver_id, message_id: currentMessage.id, type: 'new_message', sender_id: socket.userId })
//             }
//         } catch (error) {
//             console.error("Error in send_message:", error);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//         if (socket.userId) {
//             delete users[socket.userId];
//         }
//     });
// });

// ✅ Initialize Socket.io logic
scoketHandler(io)

await DbConnection().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("Database Connection Failed --->", error);
});

