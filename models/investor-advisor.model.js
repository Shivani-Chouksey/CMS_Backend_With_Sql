import { DataTypes } from "sequelize"

export const Investor_Advisor_User =  (sequelize) => {
    const attributes = {
        name: {
            type: DataTypes.STRING,
            required: true
        },
        email: {
            type: DataTypes.STRING,
            required: true
        },
        mobile_number: {
            type: DataTypes.INTEGER
        },
        address: {
            type: DataTypes.STRING
        },
        profile_image: {
            type: DataTypes.STRING
        },
        access_group: {
            type: DataTypes.ENUM,
            values: ['intermediate', 'advanced'],
            default: 'intermediate'
        },
        app_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'app_user',
                key: 'id',
            },
        }

    }
    const options = {
        timestamp: true
    }
    return  sequelize.define('investor_advisor', attributes, options)
}