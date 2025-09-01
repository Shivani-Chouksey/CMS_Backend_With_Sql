import { response } from "express"
import { db } from "../config/db-connection.js"

export const CreateNews = async (req, res) => {
    // console.log('CreateNews -->',req.file,req.user?.id);

    try {
        const existingNews = await db.news.findOne({
            where: {
                title: req.body.title
            }
        })

        if (existingNews) {
            return res.status(208).json({ Success: false, message: "News Title Already Exist" })
        }

        const responseData = await db.news.create({ ...req.body, created_user_id: req.user?.id, news_poster: req.file?.path })
        return res.status(201).json({ Success: true, message: "New Created", data: responseData })


    } catch (error) {
        console.log("News Creating Error --->", error);

        res.status(500).json({ Success: false, message: "News Created Error", error: error })
    }
}


export const GetAllNews = async (req, res) => {
    try {
        const responseData = await db.news.findAll({include:[{model:cms_user,as :"csm_user"}]})
        return res.status(200).json({ Success: true, message: "Retrive All News", data: responseData })

    } catch (error) {
        console.log("News Getting Error --->", error);

        res.status(500).json({ Success: false, message: "News Created Error", error: error })
    }
}
