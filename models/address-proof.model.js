export const AddressProof = async (sequelize) => {
    const attributes = {
        card_issuance_date: {
            type: DataTypes.DATE
        },
        card_number: {
            type: DataTypes.DATE

        },
        card_image: {
            type: DataTypes.STRING
        },
        app_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'app_user',
                key: 'id',
            },
        },
        investor_advisor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'investor_advisor',
                key: 'id',
            },
        },
        // legal_entity_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'legal_entity',
        //         key: 'id',
        //     },
        // },
        company_representative_id: {
            type: DataTypes.INTEGER,
            rererences: {
                model: 'company_represtative',
                key: "id"
            }
        }

    }
    const option = {
        timestamp: true
    }
    return await sequelize.define('address_proof', attributes, option)
}