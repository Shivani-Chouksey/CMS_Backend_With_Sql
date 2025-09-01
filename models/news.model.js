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
            imagePath: {
                type: DataTypes.STRING,

            },
            created_user_id: {
                type: DataTypes.UUID
            }
        },
        {
            timestamps: true,
            freezeTableName: true,
        },)

}

export { News }
