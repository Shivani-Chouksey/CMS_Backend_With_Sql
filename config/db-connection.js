import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise';
// export const sequelize = new Sequelize(process.env.SQL_URI)
const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

export const sequelize = new Sequelize(database, user, password, {
    host: host, // or your remote IP
    dialect: "mysql",
    pool: { max: 5, min: 0, idle: 10000 },
    logging: false
});

export const DbConnection = async () => {
    try {
        await mysql.createConnection({ host, user, password, database, pool: { max: 5, min: 0, idle: 10000 } });

        await sequelize.authenticate();

        console.log("Database Connected Successfully")
    } catch (error) {
        console.log("Database Connection Failed ---> ", error)
    }
}