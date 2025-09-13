import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js"
import { Conflict, Created, NotFound, ServerError, Success } from "../utils/response.js"

export const CreateCompany = async (req, res) => {
    try {
        const existingCompany = await db.company.findOne({ where: { name: req.body.name } })
        if (existingCompany) {
            await RemoveFile(req.file?.path)
            return Conflict(res, `Company Details Already Exist for name : ${req.body.name}`)
        }
        const reaponseData = await db.company.create({ ...req.body, logo_path: req.file?.path, created_by: req.user?.id })
        return Created(res, reaponseData, "Company Created")

    } catch (error) {
        await RemoveFile(req.file?.path)
        console.log("Create Company Error -->", error);
        if (error.name === 'SequelizeDatabaseError' || error.parent.code === 'ER_BAD_FIELD_ERROR') {
            return ServerError(res, 'Internal Server Error', error.original?.sqlMessage)
        }
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const GetCompanyList = async (req, res) => {
    try {
        const responseData = await db.company.findAll({ include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] });
        return Success(res, responseData, "All Company List")
    } catch (error) {
        console.log('GetCompanyList-->', error);
        if (error.name === 'SequelizeEagerLoadingError') {
            return ServerError(res, 'Internal Server Error', error)
        }
        return ServerError(res, 'Internal Server Error', error)

    }
}



export const GetCompanyDetail = async (req, res) => {
    try {
        const { id } = req.params
        const responseData = await db.company.findOne({ where: { id }, include: [{ model: db.cmsUser, attributes: ['id', 'role', 'userName'] }] })
        if (!responseData || responseData === null || responseData === undefined) {
            return NotFound(res, `Detail Not Exist for ID ${id}`)
        }
        return Success(res, responseData, "Company Detail")
    } catch (error) {
        console.log('GetCompanyDetail-->', error);
        return ServerError(res, 'Internal Server Error', error)

    }
}


export const UpdateCompanyDetail = async (req, res) => {
    try {
        console.log(req.body, req.file);
        const { id } = req.params;
        const existingCompany = await db.company.findOne({ where: { id } });
        if (existingCompany === null) {
            await RemoveFile(req.file?.path)
            return NotFound(res, `Company Not Exist with Id  : ${id}`)
        }
        if (req.file?.path && existingCompany?.logo_path) {
            await RemoveFile(existingCompany?.logo_path)
            existingCompany.logo_path = req.file?.path
        }
        existingCompany.content = req.body?.content
        existingCompany.save();
        const responseData = await db.company.findOne({ where: { id }, include: [{ model: db.cmsUser, attributes: ['id', 'role', 'userName'] }] })
        return Success(res, responseData, "Company Detail Updated")
    }
    catch (error) {
        console.log(error);
        await RemoveFile(req.file?.path)
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const DeleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCompany = await db.company.findOne({ where: { id } });
        if (existingCompany === null) {
            await RemoveFile(req.file?.path)
            return NotFound(res, `Company Not Exist with Id  : ${id}`)
        }
        await RemoveFile(existingCompany.logo_path)
        await db.company.destroy({ where: { id } })
        return Success(res, null, `Company Deleted Id : ${id}`)
    } catch (error) {
        console.log(error);
        return ServerError(res, 'Internal Server Error', error)
    }
}