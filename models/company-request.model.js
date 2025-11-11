import { DataTypes } from "sequelize";

// CompanyRequest.js
export const CompanyRequest = (sequelize) => {
  return sequelize.define("company_request", {
    ai_officer_req_inti: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {
        model: 'app_user',
        key: 'id'
      }
    },
    ai_officer_req_validator: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {
        model: 'app_user',
        key: 'id'
      }
    },
    ai_officer_req_status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      // allowNull: false,
      defaultValue: "pending",

    },
    ai_officer_id: {
      type: DataTypes.INTEGER,
      // allowNull: true,
      references: {
        model: 'cms_user',
        key: 'id'
      }
    },
    ai_officer_assigned_by: {
      type: DataTypes.INTEGER,
      // allowNull: true,
      references: {
        model: 'cms_user',
        key: 'id'
      }
    },
    ai_officer_assigned_at: {
      type: DataTypes.DATE,
    },
    receviers_ids:{
      type:DataTypes.JSONB
    },
    requester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'app_user',
        key: 'id'
      },
      comment: "User who initiated the request"
    },
    approver_id: {
      type: DataTypes.INTEGER,
      // allowNull: true, // Will be set when someone accepts
      references: {
        model: 'app_user',
        key: 'id',
        
      },
      comment: "User who accepts or declines the request"
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
    accept_req: {
      type: DataTypes.BOOLEAN,
      default: null // null = pending, true = accepted, false = declined
    },
    chat_note_accept_status: {
      type: DataTypes.BOOLEAN,
      default: null
    },
    expressed_interest: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    status: {
      type: DataTypes.ENUM( 'active', 'chat_active', 'closed', 'rejected', 'expired'),
      defaultValue: 'active'
    }

  }, {
    timestamps: true,
    freezeTableName: true,
  });
};