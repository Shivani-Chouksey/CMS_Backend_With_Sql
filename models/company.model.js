import { DataTypes } from "sequelize"

export const Company = (sequelize) => {
    const attribute = {
        name: {
            type: DataTypes.STRING,
            unique: true,
            required: [true, "Name is Required"]
        },
        content: {
            type: DataTypes.TEXT

        },
        logo_path: {
            type: DataTypes.STRING,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
    const option = {
        timestamps: true,
        freezeTableName: true,
    }
    return sequelize.define("company", attribute, option)
}