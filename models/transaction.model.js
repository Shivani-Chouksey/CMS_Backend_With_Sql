import { DataTypes } from "sequelize";

// models/UserCompany.js
export const UserCompanyTransaction = (sequelize) => {
  return sequelize.define("user_company_transaction", {
    seller_id: {
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
    company_req_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {
        model: "company_request",
        key: "id"
      },
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "app_user",
        key: "id"
      },
    },
    review_message: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ai_officer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cms_user",
        key: "id"
      },
    },
  }, {
    timestamps: true,
    freezeTableName: true
  });
};
