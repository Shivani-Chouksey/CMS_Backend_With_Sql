import { DataTypes } from "sequelize"

export const AddressProof =  (sequelize) => {
    const attributes = {
        card_issuance_date: {
            type: DataTypes.DATE
        },
        card_number: {
            type: DataTypes.INTEGER

        },
        card_image: {
            type: DataTypes.STRING
        },
        app_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'app_users',
                key: 'id',
            },
        },
        investor_advisor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'investor_advisors',
                key: 'id',
            },
        },
        legal_entity_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'legal_entities',
                key: 'id',
            },
        },
        company_representative_id: {
            type: DataTypes.INTEGER,
            rererences: {
                model: 'company_represtatives',
                key: "id"
            }
        }

    }
    const option = {
        timestamp: true
    }
    return  sequelize.define('address_proof', attributes, option)
}