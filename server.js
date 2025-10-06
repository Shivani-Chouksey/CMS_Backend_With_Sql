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

// ✅ Initialize Socket.io logic
scoketHandler(io)

await DbConnection().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("Database Connection Failed --->", error);
});

