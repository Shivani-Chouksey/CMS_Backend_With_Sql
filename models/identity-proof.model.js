export const IdentityProof = async (sequelize) => {
    const attributes = {
        id_type: {
            types: DataTypes.ENUM,
            values: ['pan_card', 'id_card'],
            required: true,
            allowNull: false
        },
        id_number: {
            type: DataTypes.NUMBER,
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
                model: 'investor_advisor',
                key: 'id',
            },
        },
        legal_entity_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'legal_entity',
                key: 'id',
            },
        },
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
    return await sequelize.define('identity_proof', attributes, option)
}