import express from 'express';
import 'dotenv/config';
import All_API_Routes from './routes/index.js';
import { DbConnection } from './config/db-connection.js';
import morgan from 'morgan';
import path from 'node:path';
import fs from 'node:fs';

const app = express();
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


// All Routes
app.use('/api/v1', All_API_Routes);

await DbConnection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("Database Connection Failed --->", error);
});

