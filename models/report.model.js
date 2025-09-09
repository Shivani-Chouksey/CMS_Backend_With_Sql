import { DataTypes } from "sequelize"

function Report(sequelize) {
    const attributes = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        compniesId: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        role: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        access_group: {
            type: DataTypes.ENUM,
            values: ['intermediate', 'advanced'],
            default: 'intermediate'
        },
        file: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdBy:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }
    const options = {
        timestamps: true
    }
    return sequelize.define('report', attributes, options)
}


export { Report }