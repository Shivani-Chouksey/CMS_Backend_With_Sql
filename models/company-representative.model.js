import { DataTypes } from "sequelize"

export const CompanyRepresentative =  (sequelize) => {
    const attributes = {
        name: {
            type: DataTypes.STRING,
            alllowNull: false,
            required: true
        },
        email: {
            type: DataTypes.STRING,
            alllowNull: false,
            required: true
        },
        mobile_number: {
            type: DataTypes.INTEGER,
            alllowNull: false,
            required: true
        },
        app_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'app_user',
                key: 'id',
            },
        },
        // investor_advisor_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'investor_advisor',
        //         key: 'id',
        //     },
        // },
        legal_entity_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'legal_entities',
                key: 'id',
            },
        }
    }
    const option = {
        timestamp: true
    }
    return  sequelize.define('company_represtative', attributes, option)
}