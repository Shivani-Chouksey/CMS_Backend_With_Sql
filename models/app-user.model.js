import { DataTypes } from "sequelize"

function AppUser(sequelize) {
    const attributes = {
        role: {
            type: DataTypes.ENUM,
            values: ['investor', 'advisor', 'legal_entity']
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
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
    return sequelize.define('app_user', attributes, options)
}

export { AppUser }