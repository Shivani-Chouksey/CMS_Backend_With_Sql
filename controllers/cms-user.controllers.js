import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { db } from "../config/db-connection.js";
import { Conflict, Created, NotFound, ServerError, Success } from "../utils/response.js";


export const CreateCmsSuperAdmin = async (req, res) => {
    try {
        const IsUserExist = await db.cmsUser.findOne({ where: { email: req.body.email } })
        console.log("CreateCmsSuperAdmin IsUserExist -->", IsUserExist);

        if (IsUserExist) {
            return Conflict(res, 'Already Exist', null)
        }
        await db.cmsUser.create(req.body);
        return Created(res, null, 'CMS User Created Successfully')
    } catch (error) {
        console.log('CreateCmsSuperAdmin --->', error);

        return ServerError(res, 'Internal Server Error', error?.errors[0].message)
    }
}
export const CreateCmsAdmin = async (req, res) => {
    try {
        const IsUserExist = await db.cmsUser.findOne({ where: { email: req.body.email } })
        console.log("CreateCmsAdmin IsUserExist -->", IsUserExist);

        if (IsUserExist) {
            return Conflict(res, 'Already Exist', null)
        }
        await db.cmsUser.create(req.body);
        return Success(res, null, 'CMS User Created Successfully')

    } catch (error) {
        return ServerError(res, 'Internal Server Error', error?.errors[0].message)
    }
}


export const LoginCmsUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const IsUserExist = await db.cmsUser.findOne({ where: { email } })
        console.log("LoginCmsUser IsUserExist -->", IsUserExist);

        if (!IsUserExist || IsUserExist === null) {
            return NotFound(res, 'Not Exist', null)
        }
        const ispasswordMatch = await bcrypt.compare(password, IsUserExist.password);
        // console.log("ispasswordMatch -->", ispasswordMatch, "process.env.JWT_SECREt", process.env.JWT_SECRET);

        if (!ispasswordMatch) {
            return Conflict(res, 'Invalid Credentails', null)
        }
        const payloadOption = {
            id: IsUserExist.id,
            role: IsUserExist.role
        }
        const token = await jwt.sign(payloadOption, process.env.JWT_SECRET, { expiresIn: process.env.jWT_EXPIRY });
        console.log("csm-user token -->", token);
        return Success(res, { token: token }, 'Login Successfully')
    } catch (error) {
        console.log("LoginCmsUser error -->", error);
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const GetAllCMSUser = async (req, res) => {
    try {
        let { limit, page } = req.query;

        // Convert to numbers if present
        limit = limit ? parseInt(limit) : null;
        page = page ? parseInt(page) : null;

        let queryOptions = {
            attributes: { exclude: ['password'] }
        };

        if (limit && page) {
            const skip = (page - 1) * limit;
            queryOptions.limit = limit;
            queryOptions.offset = skip;
        }

        const responseData = await db.cmsUser.findAll(queryOptions);
        const totalRecordCount = await db.cmsUser.count();
        
        const pagination = limit && page
            ? {
                page,
                limit,
                totalRecord: totalRecordCount,
                totalPages: Math.ceil(totalRecordCount / limit)
            }
            : null;

        return Success(res, { data: responseData, pagination: pagination }, 'CMS Users List')
    } catch (error) {
        console.error('GetAllCMSUser', error);

        return ServerError(res, 'Internal Server Error', error?.errors[0].message)
    }
}


export const DeleteCmsUser = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUser = await db.cmsUser.findOne({ where: { id } });
        if (!existingUser || existingUser === null) {
            return NotFound(res, 'CMS User Not Found', null)
        }
        await db.cmsUser.destroy({ where: { id } })
        return Success(res, null, 'CMS User Deleted Successfully')
    } catch (error) {
        console.error("DeleteCmsUser error --->", error);
        return ServerError(res, 'Internal Server Error ', error?.errors[0]?.message)
    }
}

export const DropCmsuserTable = async (req, res) => {
    try {
        const response = await db.cmsUser.drop('cms-user');
        console.log("ResetCmsuserTable response -->", response);

        return res.status(200).json({ Success: true, message: "CMS User Table Deleted Successfully", response });
    } catch (error) {
        console.log("ResetCmsuserTable error -->", error);

        return res.status(500).json({ Success: false, message: "CMS Delete Failed", error });
    }
}

export const UpdateCmsUser = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUser = await db.cmsUser.findOne({ where: { id } });
        if (!existingUser || existingUser === null) {
            return NotFound(res, 'CMS User Not Found', null)
        }
        await db.cmsUser.update({ role: req.body.role, isActive: req.body.isActive }, { where: { id } });
        const responseData = await db.cmsUser.findOne({ where: { id }, attributes: { exclude: ['password'] } });
        return Success(res, responseData, 'CMS User Updated Successfully')
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error?.errors[0]?.message)

    }
}

export const GetCurrentCmsUser = async (req, res) => {
    try {
        const loggedInUser = req.user;
        // console.log('loggedInUser -->', loggedInUser);
        const resposeData = await db.cmsUser.findByPk(loggedInUser.id, { attributes: { exclude: ['password'] } });
        console.log("GetCurrentCmsUser ResponseData --->", resposeData);

        if (!resposeData || resposeData === null) {
            return NotFound(res, 'CMS User Not Found', null)
        }
        return Success(res, resposeData, 'Current Logged In User Retrived Successfully')

    } catch (error) {
        return ServerError(res, 'Internal Server Error', error?.errors[0]?.message)
    }
}
