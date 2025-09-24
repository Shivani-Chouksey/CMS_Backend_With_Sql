import { Op } from "sequelize";
import { db } from "../config/db-connection.js";
import { RemoveFile } from "../utils/helpers.js";
import { Created, NotFound, ServerError, Success } from "../utils/response.js";

export const CreateReport = async (req, res) => {
    try {
        const isReportExist = await db.report.findOne({ where: { name: req.body.name } })
        if (isReportExist) {
            if (req.file || req.file != undefined) {
                RemoveFile(req.file?.path)
            }
            return NotFound(res, 'Report already exist with this name')
        }
        const newReport = await db.report.create({ ...req.body, file: req.file?.path, createdBy: req.user?.id, role: JSON.stringify(req?.body.role) })
        return Created(res, newReport, 'Report Created Successfully')
    } catch (error) {
        if (req.file || req.file != undefined) {
            RemoveFile(req.file?.path)
        }
        console.log(error);
        ServerError(res, 'Internal Server Error', error)
    }
}


export const GetReportList = async (req, res) => {
    try {
        let { limit, page } = req.query;

        // Convert to numbers if present
        limit = limit ? parseInt(limit) : null;
        page = page ? parseInt(page) : null;

        let queryOptions = {
            where: {
                role: {
                    [Op.like]: `%${req.user.role}%`
                }
            },
            attributes: { exclude: ['access_group', 'createdBy'] },
            include: { model: db.cmsUser, as: "createdByUser", attributes: ['id', "username", 'role'] },
        }

        if (limit && page) {
            const skip = (page - 1) * limit;
            queryOptions.limit = limit;
            queryOptions.offset = skip;
        }
        const reportList = await db.report.findAll();
        const totalRecordCount = await db.report.count();

        const pagination = limit && page
            ? {
                page,
                limit,
                totalRecord: totalRecordCount,
                totalPages: Math.ceil(totalRecordCount / limit)
            }
            : null;


        return Success(res, { data: reportList, pagination }, "Report List")
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error)

    }
}

export const GetReportDetail = async (req, res) => {
    try {
        const responseData = await db.report.findOne({
            where: {

                id: req.params.id,
                role: {
                    [Op.like]: `%${req.user.role}%`
                }
            },
            include: { model: db.cmsUser, as: "createdByUser", attributes: ['id', "username", 'role'] },
            attributes: { exclude: ['role', 'createdBy'] }
        });
        if (!responseData || responseData === null) {
            return NotFound(res, 'Report Not Exist')
        }
        if (typeof responseData?.compniesId === "string") {
            responseData.compniesId = JSON.parse(responseData?.compniesId)
        }
        const companyRes = await db.company.findAll({ where: { id: { [Op.in]: responseData?.compniesId } }, attributes: { exclude: ['created_by'] } })
        // console.log("companyRes", companyRes);
        return Success(res, { ...responseData.toJSON(), companies: companyRes }, "Report Detail")
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error)

    }
}


export const DeleteReport = async (req, res) => {
    try {
        const isReportExist = await db.report.findOne({ where: { id: req.params.id } });
        if (!isReportExist || isReportExist === null) {
            return NotFound(res, "Report Not Exist")
        }
        await db.report.destroy({ where: { id: req.params.id } });
        RemoveFile(isReportExist.file)
        return Success(res, null, "Report Deleted Successfully")
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const UpdateReportDetail = async (req, res) => {
    try {
        // console.log('UpdateReportDetail -->', req.body, req.file);
        const isReportExist = await db.report.findOne({ where: { id: req.params.id } });
        if (!isReportExist || isReportExist === null) {
            return NotFound(res, "Report Not Exist")
        }
        if (req.file) {
            RemoveFile(isReportExist?.file);
            isReportExist.file = req.file?.path
            isReportExist.save()
        }

        const updatedReportId = await db.report.update({ ...req.body, role: JSON.stringify(req?.body.role) }, { where: { id: req.params.id } });
        const updatedReport = await db.report.findOne({
            where: {

                id: updatedReportId
            },
            include: { model: db.cmsUser, as: "createdByUser", attributes: ['id', "username", 'role'] },
            attributes: { exclude: ['role', 'createdBy'] }
        });
        return Success(res, updatedReport, "Report Updated Successfully")
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error)
    }
}