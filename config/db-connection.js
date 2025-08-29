import { Sequelize } from "sequelize";
 export const sequelize = new Sequelize(process.env.SQL_URI)

export const DbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log("Database Connection Failed", error)
    }
}