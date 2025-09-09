import { Op } from "sequelize";
import { db } from "../config/db-connection.js";
import { RemoveFile } from "../utils/helpers.js";

export const CreateReport = async (req, res) => {
    try {
        console.log(req.body, req.file);

        const isReportExist = await db.report.findOne({ where: { name: req.body.name } })
        if (isReportExist) {
            RemoveFile(req.file?.path)
            return res.status(400).json({ Success: false, message: "Report already exist with this name" })
        }

        const newReport = await db.report.create({ ...req.body, file: req.file?.path, createdBy: req.user?.id })
        return res.status(201).json({ Success: true, message: "Report Created Successfully", data: newReport })
    } catch (error) {
        RemoveFile(req.file?.path)
        console.log(error);

        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

    }
}


export const GetReportList = async (req, res) => {
    try {
        console.log("Logged in user details", req.user);

        const reportList = await db.report.findAll({
            where: {
                role: {
                    [Op.like]: `%${req.user.role}%`
                }
            },
            attributes: { exclude: ['role', 'access_group', 'createdBy'] },
            include: { model: db.cmsUser, as: "createdByUser", attributes: ['id', "username", 'role'] },
        });
        return res.status(200).json({ Success: true, message: "Report List", data: reportList })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

    }
}
export const GetReportDetail = async (req, res) => {
    try {
        const responseData = await db.report.findOne({
            where: {
                id: req.params.id, role: {
                    [Op.like]: `%${req.user.role}%`
                }
            },
            include: { model: db.cmsUser, as: "createdByUser", attributes: ['id', "username", 'role'] },
            attributes: { exclude: ['role', 'createdBy'] }
        });
        if (!responseData || responseData === null) {
            return res.status(404).json({ Success: false, message: "Report Not Exist" })

        }
        if (typeof responseData?.compniesId === "string") {
            responseData.compniesId = JSON.parse(responseData?.compniesId)
        }
        const companyRes = await db.company.findAll({ where: { id: { [Op.in]: responseData?.compniesId } }, attributes: { exclude: ['created_by'] } })
        console.log("companyRes", companyRes);
        return res.status(200).json({ Success: true, message: "Report Detail", data: { ...responseData.toJSON(), companies: companyRes } })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

    }
}


export const DeleteReport = async (req, res) => {
    try {
        const isReportExist = await db.report.findOne({ where: { id: req.params.id } });
        if (!isReportExist || isReportExist === null) {
            return res.status(404).json({ Success: false, message: "Report Not Exist" })
        }
        await db.report.destroy({ where: { id: req.params.id } });
        RemoveFile(isReportExist.file)
        return res.status(200).json({ Success: true, message: "Report Deleted Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}

export const UpdateReportDetail = async (req, res) => {
    try {
        // console.log('UpdateReportDetail -->', req.body, req.file);
        const isReportExist = await db.report.findOne({ where: { id: req.params.id } });
        if (!isReportExist || isReportExist === null) {
            return res.status(404).json({ Success: false, message: "Report Not Exist" })
        }
        if (req.file) {
            RemoveFile(isReportExist?.file);
            isReportExist.file = req.file?.path
            isReportExist.save()
        }

        const updatedReport = await db.report.update({ ...req.body }, { where: { id: req.params.id } });
        return res.status(200).json({ Success: true, message: "Report Updated Successfully", data: updatedReport })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}