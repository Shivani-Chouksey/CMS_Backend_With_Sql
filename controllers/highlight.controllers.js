import { db } from "../config/db-connection.js";
import { Conflict, Created, ServerError, Success } from "../utils/response.js";

export const CreateHighLight = async (req, res) => {
    try {
        // console.log(req.body);
        const IsHighExist = await db.highlight.findOne({ where: { title: req.body.title } })
        if (IsHighExist) {
            return Conflict(res, 'Highlight With This Title Already Exist', 'Conflict Error')
        }
        const responseData = await db.highlight.create({ ...req.body, createdBy: req.user?.id });
        return Created(res, responseData, 'Highlight Created Successfully')
    } catch (error) {
        console.log('CreateHighLight Error', error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return ServerError(res, 'Internal Server Error ', messages)
        }

        return ServerError(res, 'Internal Server Error', error)
    }
}

export const UpdateHighLight = async (req, res) => {
    try {
        // console.log(req);
        const id = req.pramas?.id
        console.log(id);
        const IsHighExist = await db.highlight.findOne({ where: id });
        console.log("IsHighExist", IsHighExist);

        if (!IsHighExist || IsHighExist === null || IsHighExist === undefined) {
            return NotFound(res, "Highlight Not Exist")
        }
        const responseId = await db.highlight.update({ ...req.body }, { where: { id: req.params?.id } })
        const responseData = await db.highlight.findOne({ where: { id: responseId }, include: { model: db.cmsUser, as: "createdByUser", attributes: ['id', "username", 'role'] }, })
        return Success(res, responseData, "Highlight Updated Successfully")
    } catch (error) {
        console.log('UpdateHighLight Error', error);
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const DeleteHighLight = async (req, res) => {
    try {
        const IsHighExist = await db.highlight.findOne({ where: { id: req.params?.id } });
        if (!IsHighExist) {
            return NotFound(res, "Highlight Not Exist")
        }
        await db.highlight.destroy({ where: { id: req.params?.id } });
        return Success(res, null, "HighLight Deleted !")
    } catch (error) {
        console.log('DeleteHighLight Error', error);
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const GetHighLightList = async (req, res) => {
    try {
        let { page, limit } = req.query
        page = page ? parseInt(page) : null
        limit = limit ? parseInt(limit) : null

        const queryOptions = { include: [{ model: db.cmsUser, as: "createdByUser", attributes: ['id', 'username', 'role'] }] }

        if (page && limit) {
            const skip = (page - 1) * limit;
            queryOptions.limit = limit;
            queryOptions.offset = skip;
        }

        const responseData = await db.highlight.findAll(queryOptions);
        const totalRecordCount = await db.highlight.count();
        const pagination = limit && page
            ? {
                page,
                limit,
                totalRecord: totalRecordCount,
                totalPages: Math.ceil(totalRecordCount / limit)
            }
            : null;
        return Success(res, { data: responseData, pagination }, "Highlight List")
    } catch (error) {
        console.log('GetHighLightList Error', error);
        return ServerError(res, 'Internal Server Error', error)
    }
}


export const GetHighLightDetail = async (req, res) => {
    try {
        const responseData = await db.highlight.findOne({ where: { id: req.params.id }, include: [{ model: db.cmsUser, as: "createdByUser", attributes: ['id', 'username', 'role'] }] })
        if (responseData === undefined || responseData === null) {
            return NotFound(res, "Highlight Detail Not Found")
        }
        return Success(res, responseData, "Highlight Detail")
    } catch (error) {
        console.log('GetHighLightList Error', error);
        return ServerError(res, 'Internal Server Error', error)
    }
}