import { Op } from "sequelize";
import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js";
import { Conflict, Created, NotFound, ServerError, Success } from "../utils/response.js";

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
            return Conflict(res, 'News Title Already Exist', 'Conflict Error')
        }
        const responseData = await db.news.create({ ...req.body, created_user_id: req.user?.id, news_poster: req.file?.path })
        return Created(res, responseData, 'News Created')
    } catch (error) {
        console.log("News Creating Error --->", error);
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return ServerError(res, 'Internal Server Error', error)

        }
        return ServerError(res, 'Internal Server Error', error)

    }
}


export const GetAllNews = async (req, res) => {
    try {
        const responseData = await db.news.findAll({ include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        return Success(res, responseData, "Retrive All News")
    } catch (error) {
        console.log("News Getting Error --->", error);
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const GetNewDetail = async (req, res) => {
    try {
        const responseData = await db.news.findOne({ where: { title: req.params?.title }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        return Success(res, responseData, "Retrive  News")
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const UpdateNewsDetail = async (req, res) => {
    try {
        console.log('UpdateNewsDetail', req.body, req.file);
        const existNews = await db.news.findOne({ where: { id: req.params.id } })
        if (!existNews || existNews == null) {
            return NotFound(res, "News Not Exist")
        }
        if (req.file?.path && existNews.news_poster) {
            await RemoveFile(existNews.news_poster)
        }
        existNews.title = req.body?.title
        existNews.content = req.body?.content
        existNews.news_poster = req.file?.path
        await existNews.save()
        const response = await db.news.findOne({ where: { id: req.params?.id }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        return Success(res, response, "Update  News Successfully")

    } catch (error) {
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return ServerError(res, 'Internal Server Error', error.errors[0].message)

        }
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const DeleteNews = async (req, res) => {
    try {
        const existNews = await db.news.findOne({ where: { id: req.params.id } })
        if (!existNews || existNews == null) {
            return NotFound(res, "News Not Exist")
        }
        await db.news.destroy({ where: { id: req.params.id } })
        const response = await RemoveFile(existNews.news_poster)
        console.log("response RemoveFile-->", response);
        return Success(res, null, "News Deleted Successfully")
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error)

    }
}


