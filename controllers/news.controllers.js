import { db } from "../config/db-connection.js"

export const CreateNews = async (req, res) => {
    try {
        const existingNews = await db.news.findOne({
            where: {
                title: req.body.title
            }
        })
        
        if (existingNews) {
            return res.status(208).json({ Success: false, message: "News Title Already Exist" })
        }

        const responseData = await db.news.create({...req.body,created_user_id:req.user?.id})
        return res.status(201).json({ Success: true, message: "New Created" ,data:responseData})


    } catch (error) {
        console.log("News Creating Error --->" ,error);
        
        res.status(500).json({ Success: false,message:"News Created Error",error:error })
    }
}

