import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js"

export const CreateCompany = async (req, res) => {
    try {
        // console.log("CreateCompany req -->", req.file, req.user);
        const existingCompany = await db.company.findOne({ where: { name: req.body.name } })
        if (existingCompany) {
            await RemoveFile(req.file?.path)
            return res.status(208).json({ message: "Company Details Already Exist", Success: false })
        }
        const reaponseData = await db.company.create({ ...req.body, logo_path: req.file?.path, created_by: req.user?.id })
        return res.status(201).json({ Success: true, message: "Company Created", data: reaponseData })

    } catch (error) {
        await RemoveFile(req.file?.path)
        console.log("Create Company Error -->", error);
        if (error.name === 'SequelizeDatabaseError' || error.parent.code === 'ER_BAD_FIELD_ERROR') {
            return res.status(500).json({ message: "Internal Server Error", Success: false, error: error.original?.sqlMessage })
        }

        return res.status(500).json({ message: "Internal Server Error", Success: false, error: error })
    }
}


export const GetCompanyList = async (req, res) => {
    try {
        const responseData = await db.company.findAll({ include: [{ model: db.cmsUser, as: "cms_user", attributes: ['id', 'username', 'role'] }] });
        return res.status(200).json({ message: "All Company List", Success: true, data: responseData })

    } catch (error) {
        console.log('GetCompanyList-->', error);
        if (error.name === 'SequelizeEagerLoadingError') {
            return res.status(500).json({ message: "Internal Server Error", Success: false, error: error })

        }
        return res.status(500).json({ message: "Internal Server Error", Success: false, error: error })

    }
}



export const GetCompanyDetail = async (req, res) => {
    try {
        const { id } = req.params
        const responseData = await db.company.findOne({ where: { id }, include: [{ model: db.cmsUser, attributes: ['id', 'role', 'userName'] }] })
        // console.log("GetCompanyDetail -->", responseData);

        if (!responseData || responseData === null || responseData === undefined) {
            return res.status(404).json({ message: `Detail Not Exist for ID ${id}`, Success: false })
        }
        return res.status(200).json({ message: "Company Detail", Success: true, data: responseData })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", Success: false, error: error })

    }
}


export const UpdateCompanyDetail = async (req, res) => {
    try {
        console.log(req.body, req.file);

        const { id } = req.params;
        const existingCompany = await db.company.findOne({ where: { id } });
        if (existingCompany === null) {
            await RemoveFile(req.file?.path)
            return res.status(404).json({ message: `Company Not Exist with Id  : ${id}`, Success: false })
        }
        if (req.file && existingCompany?.logo_path) {
            await RemoveFile(existingCompany?.logo_path)
            existingCompany.logo_path = req.file?.path
        }
        existingCompany.content = req.body?.content
        existingCompany.save();
        const responseData = await db.company.findOne({ where: { id }, include: [{ model: db.cmsUser, attributes: ['id', 'role', 'userName'] }] })
        return res.status(200).json({ Success: true, message: "Company Detail Updated", data: responseData })
    }
    catch (error) {
        console.log(error);
        await RemoveFile(req.file?.path)
        return res.status(500).json({ message: "Internal Server Error", Success: false, error: error })

    }
}


export const DeleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCompany = await db.company.findOne({ where: { id } });
        if (existingCompany === null) {
            await RemoveFile(req.file?.path)
            return res.status(404).json({ message: `Company Not Exist with Id  : ${id}`, Success: false })
        }
        await RemoveFile(existingCompany.logo_path)
        await db.company.destroy({ where: { id } })
        return res.status(500).json({ message: `Company Deleted Id : ${id}`, Success: true, })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error", Success: false, error: error })

    }
}