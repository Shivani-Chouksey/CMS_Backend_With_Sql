import { DataTypes } from "sequelize"

function Messages(sequelize) {
    return sequelize.define('message', {
        sender_id: {
            type: DataTypes.INTEGER,
            require: true,
            allowNull: false
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            require: true,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
        { timestamps: true }
    )
}

export { Messages }