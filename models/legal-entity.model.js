import { DataTypes } from "sequelize"

export const legal_entity = (sequelize) => {
    const attributes = {
        company_name: {
            type: DataTypes.STRING,
            alllowNull: false,
            required: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        company_incorporation_date: {
            type: DataTypes.DATE,
            required: true,
            allowNull: false
        },
        company_Id_number: {
            type: DataTypes.INTEGER,
            required: true,
            alllowNull: false
        },
        address: {
            type: DataTypes.STRING,

        },
        profile_image: {
            type: DataTypes.STRING,

        },
        app_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'app_users',
                key: 'id',
            },
        }
        // company_representative: {
        //     name: {
        //         type: DataTypes.STRING,
        //         alllowNull: false,
        //         required: true
        //     },
        //     email: {
        //         type: DataTypes.STRING,
        //         alllowNull: false,
        //         required: true
        //     },
        //     mobile_number: {
        //         type: DataTypes.NUMBER,
        //         alllowNull: false,
        //         required: true
        //     },
        //     identity_proof: {
        //         id_type: {
        //             types: DataTypes.ENUM,
        //             values: ['pan_card', 'id_card'],
        //             required: true,
        //             allowNull: false
        //         },
        //         id_number: {
        //             type: DataTypes.NUMBER,
        //             required: true,
        //             allowNull: false
        //         },
        //         id_image: {
        //             type: DataTypes.STRING,
        //             required: true,
        //             allowNull: false
        //         }
        //     },
        //     address_proof: {
        //         card_issuance_date: {
        //             type: DataTypes.DATE
        //         },
        //         card_number: {
        //             type: DataTypes.DATE

        //         },
        //         card_image: {
        //             type: DataTypes.STRING
        //         }

        //     }
        // }

    }

    const options = {
        timestamp: true
    }
    return sequelize.define("legal_entity", attributes, options)
}