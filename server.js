import express from 'express';
import 'dotenv/config';
import All_API_Routes from './routes/index.js';
import { DbConnection } from './config/db-connection.js';

const app = express();
app.use(express.json());

// All Routes
app.use('/api/v1', All_API_Routes);

await DbConnection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("Database Connection Failed --->", error);
});

