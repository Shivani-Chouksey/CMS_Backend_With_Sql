import { DataTypes } from "sequelize";



function News(sequelize) {
    // define a Schema Model
    return sequelize.define('news',
        {
            title: {
                type: DataTypes.STRING,
                required: [true, "Title is required"],
                unique: true
            },
            content: {
                type: DataTypes.STRING,

            },
            news_poster: {
                type: DataTypes.STRING,

            },
            created_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'cms_user', // match your actual table name
                    key: 'id'
                }

            }
        },
        {
            timestamps: true,
            freezeTableName: true,
        })

}

export { News }
