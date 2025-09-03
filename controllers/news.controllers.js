import { Op } from "sequelize";
import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js";

export const CreateNews = async (req, res) => {
    // console.log('CreateNews -->', req.file, req.user?.id);
    try {
        const existingNews = await db.news.findOne({
            where: {
                title: {
                    [Op.like]: req.body.title
                }

            }
        })

        if (existingNews) {
            await RemoveFile(req.file?.path)
            return res.status(208).json({ Success: false, message: "News Title Already Exist" })
        }

        const responseData = await db.news.create({ ...req.body, created_user_id: req.user?.id, news_poster: req.file?.path })
        return res.status(201).json({ Success: true, message: "News Created", data: responseData })


    } catch (error) {
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return res.status(500).json({ Success: false, message: "Internal Server Error", error: error.errors[0].message })

        }
        // console.log("News Creating Error --->", error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}


export const GetAllNews = async (req, res) => {
    try {
        const responseData = await db.news.findAll({ include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })

        return res.status(200).json({ Success: true, message: "Retrive All News", data: responseData })

    } catch (error) {
        console.log("News Getting Error --->", error);

        res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}

export const GetNewDetail = async (req, res) => {
    try {
        const responseData = await db.news.findOne({ where: { title: req.params?.title }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        return res.status(200).json({ Success: true, message: "Retrive  News", data: responseData })

    } catch (error) {
        res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}

export const UpdateNewsDetail = async (req, res) => {
    try {
        console.log('UpdateNewsDetail', req.body, req.file);
        const existNews = await db.news.findOne({ where: { id: req.params.id } })
        if (!existNews || existNews == null) {
            return res.status(404).json({ Success: false, message: "News Not Exist" })
        }
        if (req.file?.path && existNews.news_poster) {
            await RemoveFile(existNews.news_poster)
        }
        existNews.title = req.body?.title
        existNews.content = req.body?.content
        existNews.news_poster = req.file?.path
        await existNews.save()
        const response = await db.news.findOne({ where: { id: req.params?.id }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })

        return res.status(200).json({ Success: true, message: "Update  News Successfully", data: response })

    } catch (error) {
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return res.status(500).json({ Success: false, message: "Internal Server Error", error: error.errors[0].message })

        }
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}


export const DeleteNews = async (req, res) => {
    try {
        const existNews = await db.news.findOne({ where: { id: req.params.id } })
        if (!existNews || existNews == null) {
            return res.status(404).json({ Success: false, message: "News Not Exist" })
        }
        await db.news.destroy({ where: { id: req.params.id } })
        const response = await RemoveFile(existNews.news_poster)
        console.log("response RemoveFile-->", response);

        return res.status(200).json({ Success: true, message: "News Deleted Successfully" });

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error });

    }
}


