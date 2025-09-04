import { DataTypes } from "sequelize"

export const AppUser = async (sequelize) => {
    const attributes = {
        role: {
            type: DataTypes.ENUM,
            values: ['investor', 'advisor', 'legal_entity']
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_by_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cms_user',
                key: 'id'
            }
        }
    }
    const options = {
        timestamp: true
    }
    return await sequelize.define('app_user', attributes, options)
}