import { Op } from "sequelize";
import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js";

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
            return res.status(208).json({ Success: false, message: "Blog Already Exist" })
        }

        const responseData = await db.blog.create({ ...req.body, created_user_id: req.user?.id, blog_poster: req.file?.path })
        return res.status(201).json({ Success: true, message: "Blog Created", data: responseData })
    } catch (error) {
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return res.status(500).json({ Success: false, message: "Internal Server Error", error: error.errors[0].message })

        }
        console.log("Blog Creating Error --->", error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}


export const GetAllBlog = async (req, res) => {
    try {
        const responseData = await db.blog.findAll({ include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })

        return res.status(200).json({ Success: true, message: "Retrive All Blog", data: responseData })

    } catch (error) {
        console.log("Blog Getting Error --->", error);

        res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}

export const GetBlogDetail = async (req, res) => {
    try {
        const responseData = await db.blog.findOne({ where: { title: req.params?.title }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })
        return res.status(200).json({ Success: true, message: "Retrive  Blog", data: responseData })

    } catch (error) {
        res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}

export const UpdateBlogDetail = async (req, res) => {
    try {
        console.log('UpdateBlogDetail', req.body, req.file);
        const existBlog = await db.blog.findOne({ where: { id: req.params.id } })
        if (!existBlog || existBlog == null) {
            return res.status(404).json({ Success: false, message: "Blog Not Exist" })
        }
        if (req.file?.path && existBlog.blog_poster) {
            await RemoveFile(existBlog.blog_poster)
        }
        existBlog.title = req.body?.title
        existBlog.content = req.body?.content
        existBlog.blog_poster = req.file?.path
        await existBlog.save()
        const response = await db.blog.findOne({ where: { id: req.params?.id }, include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] })

        return res.status(200).json({ Success: true, message: "Update Blog Successfully ", data: response })

    } catch (error) {
        await RemoveFile(req.file?.path)
        if (error.name == 'SequelizeUniqueConstraintError') {
            return res.status(500).json({ Success: false, message: "Internal Server Error", error: error.errors[0].message })

        }
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}


export const DeleteBlog = async (req, res) => {
    try {
        const existBlog = await db.blog.findOne({ where: { id: req.params.id } })
        if (!existBlog || existBlog == null) {
            return res.status(404).json({ Success: false, message: "Blog Not Exist" })
        }
        await db.blog.destroy({ where: { id: req.params.id } })
        const response = await RemoveFile(existBlog.blog_poster)
        console.log("response RemoveFile-->", response);

        return res.status(200).json({ Success: true, message: "Blog Deleted Successfully" });

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error });

    }
}


