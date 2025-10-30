import { DataTypes } from "sequelize"

function IdentityProof(sequelize) {
    const attributes = {
        id_type: {
            type: DataTypes.ENUM,
            values: ['pan_card', 'id_card'],
            required: true,
            allowNull: false
        },
        id_number: {
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        },
        id_image: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
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
    return sequelize.define('identity_proof', attributes, option)
}

export { IdentityProof }