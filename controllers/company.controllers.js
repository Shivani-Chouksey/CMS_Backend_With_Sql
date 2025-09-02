import { db } from "../config/db-connection.js"
import { RemoveFile } from "../utils/helpers.js"

export const CreateCompany = async (req, res) => {
    try {
        console.log("req file",req.file);
        
        // const existingCompany = await db.company.findOne({ where: { name: req.body.name } })
        // if (existingCompany) {
        //     await RemoveFile(req.file?.path)
        //     return res.status(208).json({ message: "Company Details Already Exist", Success: false })
        // }
        // const reaponseData = await db.company.create({ ...req.body, logo_path: req.file?.path })
        return res.status(201).json({ Success: true, message: "Company Created" })

    } catch (error) {
        await RemoveFile(req.file?.path)
        return res.status(500).json({ message: "Internal Server Error", Success: false })
    }
}