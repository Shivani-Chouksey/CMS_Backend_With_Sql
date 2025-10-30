import { DataTypes } from "sequelize";

// CompanyRequest.js
export const CompanyRequest = (sequelize) => {
  return sequelize.define("company_request", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'app_user',
        key: 'id'
      }

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
      default:false
    },
    expressed_interest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    }
  }, {
    timestamps: true,
    freezeTableName: true,
  });
};