import { DataTypes } from "sequelize"

function Notification(sequelize) {
    return sequelize.define('notification', {
        receiver_id: {
            type: DataTypes.INTEGER,
            require: true,
        },
        type: {
            type: DataTypes.ENUM(
                'company_request',
                'chat_started',
                'chat_message',
                'chat_rejected',
                'request_closed',
                'request_expired',
                'deal_completed',
                "ai_officer_req_approval",
                'ai_officer_req_rejected',
                'ai_officer_req_intilaized',
                // 'system_alert',
                // 'portfolio_update',
                // 'price_alert'
            ),
            allowNull: false
        },
        // type: {
        //     type: DataTypes.STRING,
        //     allowNull: false   // e.g. "new_message" /company_request
        // },
        sender_id: {
            type: DataTypes.INTEGER,
            require: true,
            allowNull: false
        },
        message_id: {
            type: DataTypes.INTEGER,
            
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        company_req_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'company_request',
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'read', 'expired'),
            defaultValue: 'pending'
        }


    },
        { timestamps: true }
    )
}

export { Notification }