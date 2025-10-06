import { DataTypes } from "sequelize"

function Notification(sequelize) {
   return sequelize.define('notification', {
        receiver_id: {
            type: DataTypes.INTEGER,
            require: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false   // e.g. "new_message"
        },
        sender_id: {
            type: DataTypes.INTEGER,
            require: true,
            allowNull: false
        },
        message_id: {
            type: DataTypes.INTEGER,
            require: true,
            allowNull: false
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
        { timestamps: true }
    )
}

export { Notification }