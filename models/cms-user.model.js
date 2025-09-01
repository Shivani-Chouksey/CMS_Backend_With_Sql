import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';


function CmsUser(sequelize) {
    return sequelize.define('cms_user', {
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
            timestamps: true,
            hooks: {
                beforeCreate: async ({ dataValues }) => {
                    const saltRounds = 10;
                    dataValues.password = await bcrypt.hash(dataValues.password, saltRounds);
                }
            }
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
    // CmsUserSchema.addHook("beforeCreate", async ({ dataValues }) => {
    //     // console.info("Before Creating CMS User", dataValues);
    //     const saltRounds = 10;
    //     dataValues.password = await bcrypt.hash(dataValues.password, saltRounds);
    // })
}


export { CmsUser }
