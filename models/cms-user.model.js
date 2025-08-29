import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db-connection.js';

export const CmsUserSchema = sequelize.define('cms-user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: [true, 'Username must be unique'],
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Password must contain at least 8 characters, including uppercase, lowercase letters, and numbers']

    },
    role: {
        type: DataTypes.ENUM("admin", "super-admin"),
        allowNull: false,
        defaultValue: "admin",
    }
},
    {
        freezeTableName: true,
    },
)







await CmsUserSchema.sync();
