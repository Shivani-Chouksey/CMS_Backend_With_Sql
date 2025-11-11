import { DataTypes } from "sequelize";

export const PortfolioModel = (sequelize) => {
    const attribute = {
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
            onDelete: "cascade",
            references: {
                model: "Company",
                key: "id",
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
            onDelete: "cascade",
            references: {
                model: "app_user",
                key: "id",
            },
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'DRs'
        }
    }
    const option = {
        timestamps: true,
        freezeTableName: true,
    }
    return sequelize.define("portfolio", attribute, option)
};