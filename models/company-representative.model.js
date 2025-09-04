export const CompanyRepresentative = async (sequelize) => {
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
            type: DataTypes.NUMBER,
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
                model: 'legal_entity',
                key: 'id',
            },
        }
    }
    const option = {
        timestamp: true
    }
    return await sequelize.define('company_represtative', attributes, option)
}