import { DataTypes } from "sequelize";

// models/UserCompany.js
export const UserCompanyTransaction = (sequelize) => {
  return sequelize.define("user_company_transaction", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "app_user",
        key: "id"
      }
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "company",
        key: "id"
      },
    },
    approver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cms_user",
        key: "id"
      },
    },
    review_message:{
        type:DataTypes.TEXT,
    }
  }, {
    timestamps: true,
    freezeTableName: true
  });
};
