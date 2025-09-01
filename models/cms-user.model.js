import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db-connection.js';
import bcrypt from 'bcrypt';

export const CmsUserSchema = sequelize.define('cms_user', {
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
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
},
    {
        freezeTableName: true,
    },
    // {
    //     hooks: {
    //         matchPassword: (password) => {
    //             console.log("MatchPassword Hook Called");
    //             return bcrypt.compare(password, this.password)
    //         }
    //     }
    // }
)


CmsUserSchema.addHook("beforeCreate", async ({ dataValues }) => {
    // console.info("Before Creating CMS User", dataValues);
    const saltRounds = 10;
    dataValues.password = await bcrypt.hash(dataValues.password, saltRounds);
})





await CmsUserSchema.sync();
