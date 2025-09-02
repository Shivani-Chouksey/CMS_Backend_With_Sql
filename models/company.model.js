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
        }
    }
    const option = {
        timestamps: true,
        freezeTableName: true,
    }
    return sequelize.define("company", attribute, option)
}