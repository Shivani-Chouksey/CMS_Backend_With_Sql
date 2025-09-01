import { CmsUserSchema } from "../models/cms-user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


export const CreateCmsSuperAdmin = async (req, res) => {
    try {
        const IsUserExist = await CmsUserSchema.findOne({ where: { email: req.body.email } })
        console.log("CreateCmsSuperAdmin IsUserExist -->", IsUserExist);

        if (IsUserExist) {
            return res.status(404).json({ Success: false, message: "User Already Exist " });
        }
        await CmsUserSchema.create(req.body);
        return res.status(201).json({ Success: true, message: "CMS User Created Successfully" });
    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error.errors[0].message });
    }
}
export const CreateCmsAdmin = async (req, res) => {
    try {
        const IsUserExist = await CmsUserSchema.findOne({ where: { email: req.body.email } })
        console.log("CreateCmsAdmin IsUserExist -->", IsUserExist);

        if (IsUserExist) {
            return res.status(404).json({ Success: false, message: "User Already Exist " });
        }
        await CmsUserSchema.create(req.body);
        return res.status(201).json({ Success: true, message: "CMS User Created Successfully" });
    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error.errors[0].message });
    }
}


export const LoginCmsUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const IsUserExist = await CmsUserSchema.findOne({ where: { email } })
        console.log("LoginCmsUser IsUserExist -->", IsUserExist);

        if (!IsUserExist || IsUserExist === null) {
            return res.status(404).json({ Success: false, message: "User Not Exist " });
        }
        const ispasswordMatch = await bcrypt.compare(password, IsUserExist.password);
        console.log("ispasswordMatch -->", ispasswordMatch);

        if (!ispasswordMatch) {
            return res.status(500).json({ Success: false, message: "Invalid Credentails" });
        }
        const payloadOption = {
            id: IsUserExist.id,
            role: IsUserExist.role
        }
        const token = await jwt.sign(payloadOption, process.env.JWT_SECREt, { expiresIn: process.env.jWT_EXPIRY });
        // console.log("csm-user token -->", token);

        return res.status(200).json({ Success: true, message: "Login Successfullt", data: { token } })


    } catch (error) {
        console.log("LoginCmsUser error -->", error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error });

    }
}

export const GetAllCMSUser = async (req, res) => {
    try {

        const responseData = await CmsUserSchema.findAll({ attributes: { exclude: ['password'] } });
        return res.status(200).json({ Success: true, message: "CMS Users Retrieved Successfully", data: responseData });
    } catch (error) {
        return res.status(500).json({ Success: false, message: "CMS User Retrieved Failed", error: error.errors[0].message });

    }
}


export const DeleteCmsUser = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUser = await CmsUserSchema.findOne({ where: { id } });
        if (!existingUser || existingUser === null) {
            return res.status(404).json({ Success: false, message: "CMS User Not Found" });
        }
        await CmsUserSchema.destroy({ where: { id } })
        res.status(200).json({ Success: true, message: "CMS User Deleted Successfully" });
    } catch (error) {
        console.error("DeleteCmsUser error --->", error);
        return res.status(500).json({ Success: false, message: "CMS Delete Failed", error: error?.errors[0]?.message });

    }
}

export const DropCmsuserTable = async (req, res) => {
    try {
        const response = await CmsUserSchema.drop('cms-user');
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
        const existingUser = await CmsUserSchema.findOne({ where: { id } });
        if (!existingUser || existingUser === null) {
            return res.status(404).json({ Success: false, message: "CMS User Not Found" })
        }
        await CmsUserSchema.update({ role: req.body.role ,isActive:req.body.isActive}, { where: { id } });
        const responseData = await CmsUserSchema.findOne({ where: { id }, attributes: { exclude: ['password'] } })
        return res.status(200).json({ Success: true, message: "CMS User Updated Successfully", data: responseData })
    } catch (error) {
        return res.status(500).json({ Success: false, message: "CMS Updation Failed", error });

    }
}

export const GetCurrentCmsUser = async (req, res) => {
    try {
        const loggedInUser = req.user;
        // console.log('loggedInUser -->', loggedInUser);
        const resposeData = await CmsUserSchema.findByPk(loggedInUser.id, { attributes: { exclude: ['password'] } });
        console.log("GetCurrentCmsUser ResponseData --->",resposeData);
        
        if (!resposeData || resposeData === null) {
            return res.status(404).json({ Success: false, message: "CMS User Not Found" })
        }
        return res.status(200).json({ Success: true, message: "Current Logged In User Retrived Successfully", data: resposeData })

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Logeed In User Retrive Failed", error });

    }
}