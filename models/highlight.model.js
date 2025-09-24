import { DataTypes } from "sequelize"

function HighLight(sequelize) {
    const attributes = {
        title: {
            type: DataTypes.STRING,
            required: true,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            required: true,
            // unique: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
    const option = {
        timestamps: true
    }
    return sequelize.define('highlight', attributes, option)
}

export { HighLight }


