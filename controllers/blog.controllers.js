import { Op } from "sequelize";
import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js";
import { Conflict, NotFound, ServerError, Success } from "../utils/response.js";

export const CreateBlog = async (req, res) => {
    console.log('Create blog -->', req.file, req.user?.id);
    try {
        const existingBlog = await db.blog.findOne({
            where: {
                title: {
                    [Op.like]: req.body.title
                }

            }
        })

        if (existingBlog) {
            await RemoveFile(req.file?.path)
            return Conflict(res, 'Blog Title Already Exist', 'Conflict Error')
        }
        const responseData = await db.blog.create({ ...req.body, created_user_id: req.user?.id, blog_poster: req.file?.path })
        return Created(res, responseData, 'Blog Created')
    } catch (error) {
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return ServerError(res, 'Blog Title Already Exist', error.errors[0].message)
        }
        console.log("Blog Creating Error --->", error);
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const GetAllBlog = async (req, res) => {
    try {
        console.log(req.query);
        const { page, limit } = req.query
        const skipValue = (parseInt(page) - 1) * parseInt(limit)
        const skip = parseInt(skipValue) || 0;
        const limitValue = parseInt(req.query.limit) || 5;
        const responseData = await db.blog.findAll({ offset: skip, limit: limitValue, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        const { count } = await db.blog.findAndCountAll()
        const paginationInfo = {
            currentPage: page,
            limit: limit,
            totalPage: Math.round(count / limit),
            totalCount: count
        }
        return Created(res, { data: responseData, paginationInfo: paginationInfo }, 'Blog Created')
    } catch (error) {
        console.log("Blog Getting Error --->", error);
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const GetBlogDetail = async (req, res) => {
    try {
        const responseData = await db.blog.findOne({ where: { title: req.params?.title }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        return Success(res, responseData, "Retrive  Blog")
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const UpdateBlogDetail = async (req, res) => {
    try {
        console.log('UpdateBlogDetail', req.body, req.file);
        const existBlog = await db.blog.findOne({ where: { id: req.params.id } })
        if (!existBlog || existBlog == null) {
            return NotFound(res, "Blog Not Exist")
        }
        if (req.file?.path && existBlog.blog_poster) {
            await RemoveFile(existBlog.blog_poster)
        }
        existBlog.title = req.body?.title
        existBlog.content = req.body?.content
        existBlog.blog_poster = req.file?.path
        await existBlog.save()
        const response = await db.blog.findOne({ where: { id: req.params?.id }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        return Success(res, response, "Update  Blog Successfully")
    } catch (error) {
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return ServerError(res, 'Blog Title Already Exist', error.errors[0].message)
        }
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const DeleteBlog = async (req, res) => {
    try {
        const existBlog = await db.blog.findOne({ where: { id: req.params.id } })
        if (!existBlog || existBlog == null) {
            return NotFound(res, "Blog Not Exist")
        }
        await db.blog.destroy({ where: { id: req.params.id } })
        const response = await RemoveFile(existBlog.blog_poster)
        console.log("response RemoveFile-->", response);
        return Success(res, null, "Blog Deleted Successfully")
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error)
    }
}


