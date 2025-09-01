import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise';
import { News } from "../models/news.model.js";
import { CmsUser } from "../models/cms-user.model.js";
// export const sequelize = new Sequelize(process.env.SQL_URI)
const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

export const db = {}

export const DbConnection = async () => {
    try {
        await mysql.createConnection({ host, user, password, database, pool: { max: 5, min: 0, idle: 10000 } });
        const sequelize = new Sequelize(database, user, password, {
            host: host, // or your remote IP
            dialect: "mysql",
            pool: { max: 5, min: 0, idle: 10000 },
            logging: false
        });
        await sequelize.authenticate();

        // init models and add them inside  exported db object
        db.cmsUser = CmsUser(sequelize);
        db.news = News(sequelize)


        // Assosications - Table Relations
        db.cmsUser.hasMany(db.news, { foreignKey: 'created_user_id' });
        db.news.belongsTo(db.cmsUser, { foreignKey: 'created_user_id' })
        await sequelize.sync();


        console.log("Database Connected Successfully")
    } catch (error) {
        console.log("Database Connection Failed ---> ", error)
    }
}