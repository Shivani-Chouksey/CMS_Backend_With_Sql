import { DataTypes } from "sequelize"
import jwt from "jsonwebtoken"
function AppUser(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.ENUM,
            values: ['investor', 'advisor', 'legal_entity']
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            default: true
        },
        created_by_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cms_user',
                key: 'id'
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        otp: {
            type: DataTypes.INTEGER,
        },
        otp_expiry_time: {
            type: DataTypes.DATE,
        },
        refresh_token: {
            type: DataTypes.TEXT
        },
    }
    const options = {
        timestamp: true,
        freezeTableName: true // prevents Sequelize from pluralizing table name
    }
    return sequelize.define('app_user', attributes, options)
}

AppUser.prototype.generateAccessToken = async function () {
    // generate jwt token
    const access_token = await jwt.sign({ id: this.id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.jWT_EXPIRY })
    return access_token
}
AppUser.prototype.generateRefreshToken = async function () {
    // generate jwt token
    const refresh_token = await jwt.sign({ id: this.id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.jWT_REFRESH_TOKEN_EXPIRY })
    return refresh_token
}

export { AppUser }