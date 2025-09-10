import { db } from "../config/db-connection.js";

export const CreateHighLight = async (req, res) => {
    try {
        // console.log(req.body);
        const IsHighExist = await db.highlight.findOne({ where: { title: req.body.title } })
        if (IsHighExist) {
            return res.status(208).json({ message: "Highlight With This Title Already Exist", Success: false })
        }

        const responseData = await db.highlight.create({ ...req.body, createdBy: req.user?.id });
        return res.status(201).json({ Success: true, message: "Highlight Created", data: responseData })
    } catch (error) {
        console.log('CreateHighLight Error', error);
        return res.status(500).json({ message: "Internal Server Error ", Success: false, error: error })
    }
}

export const UpdateHighLight = async (req, res) => {
    try {
        // console.log(req);
        const id = req.pramas?.id
        console.log(id);

        const IsHighExist = await db.highlight.findOne({ where: id });
        console.log("IsHighExist", IsHighExist);

        if (!IsHighExist) {
            return res.status(404).json({ message: "Highlight Not Exist", Success: false })
        }
        const responseId = await db.highlight.update({ ...req.body }, { where: { id: req.params?.id } })
        const responseData = await db.highlight.findOne({ where: { id: responseId }, include: { model: db.cmsUser, as: "createdByUser", attributes: ['id', "username", 'role'] }, })
        return res.status(201).json({ Success: true, message: "Highlight Updated", data: responseData })
    } catch (error) {
        console.log('UpdateHighLight Error', error);
        return res.status(500).json({ message: "Internal Server Error ", Success: false, error: error })
    }
}


export const DeleteHighLight = async (req, res) => {
    try {
        const IsHighExist = await db.highlight.findOne({ where: { id: req.params?.id } });
        if (!IsHighExist) {
            return res.status(404).json({ message: "Highlight Not Exist", Success: false })
        }
        await db.highlight.destroy({ where: { id: req.params?.id } });
        return res.status(200).json({ Success: true, message: "HighLight Deleted !" })
    } catch (error) {
        console.log('DeleteHighLight Error', error);
        return res.status(500).json({ message: "Internal Server Error ", Success: false, error: error })
    }
}


export const GetHighLightList = async (req, res) => {
    try {
        const responseData = await db.highlight.findAll({ include: [{ model: db.cmsUser, as: "createdByUser", attributes: ['id', 'username', 'role'] }] })
        return res.status(200).json({ message: "Highlight List", Success: true, data: responseData })
    } catch (error) {
        console.log('GetHighLightList Error', error);
        return res.status(500).json({ message: "Internal Server Error ", Success: false, error: error })
    }
}


export const GetHighLightDetail = async (req, res) => {
    try {
        const responseData = await db.highlight.findOne({ where: { id: req.params.id }, include: [{ model: db.cmsUser, as: "createdByUser", attributes: ['id', 'username', 'role'] }] })
        if (responseData === undefined || responseData === null) {
            return res.status(404).json({ message: "Highlight Detail Not Found", Success: false })

        }
        return res.status(200).json({ message: "Highlight Detail", Success: true, data: responseData })
    } catch (error) {
        console.log('GetHighLightList Error', error);
        return res.status(500).json({ message: "Internal Server Error ", Success: false, error: error })
    }
}