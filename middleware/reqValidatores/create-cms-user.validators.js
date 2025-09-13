import joi from 'joi'
import { ValidationError } from '../../utils/response.js';

const csmSuperAdminValidationSchema = joi.object({
    username: joi.string().min(3).required('Username is required'),
    email: joi.string().email().required('Email is required'),
    password: joi.string(),
    role: joi.string().required().valid('super-admin')
})

export const CmsSuperAdminCustomReqValidator = async (req, res, next) => {
    try {
        const isValid = await csmSuperAdminValidationSchema.validate(req.body);
        console.log("isValid", isValid);

        if (isValid.error) {
            // console.log('CmsCustomReqValidator -->',isValid.error);
            return ValidationError(res, isValid.error?.details[0].message, 'Invalid Request')
        }
        next()
    } catch (error) {
        console.error("CmsCustomReqValidator catch block -->", error);
        return ValidationError(res, error, 'Invalid Request')
        // return res.status(400).json({ Success: false, message: "Invalid Request", error: error })
    }
}



const csmAdminValidationSchema = joi.object({
    username: joi.string().min(3).required('Username is required'),
    email: joi.string().email().required('Email is required'),
    password: joi.string(),
    role: joi.string().required().valid('admin')
})

export const CmsAdminCustomReqValidator = async (req, res, next) => {
    try {
        const isValid = await csmAdminValidationSchema.validate(req.body)
        if (isValid.error) {
            return ValidationError(res, isValid.error?.message, 'Invalid Request')
            // console.log('CmsCustomReqValidator -->',isValid.error?.message);
            // return res.status(400).json({ Success: false, message: "Invalid Request", error: isValid.error?.message })
        }
        next()
    } catch (error) {
        console.error("CmsCustomReqValidator catch block -->", error);
        return ValidationError(res, error, 'Invalid Request')

        // return res.status(400).json({ Success: false, message: "Invalid Request", error: error })
    }
}

export const UpdateCmsuserValidator = async (req, res, next) => {
    try {
        const schema = joi.object({
            role: joi.string().required().valid('super-admin', 'admin'),
            isActive: joi.boolean().optional()
        })

        const isValid = await schema.validate(req.body)
        if (isValid.error) {
            return ValidationError(res, isValid.error?.message, 'Invalid Request')

            // return res.status(400).json({ Success: false, message: "Invalid Request", error: isValid.error?.message })

        }
        next()
    } catch (error) {
        console.error("UpdateCmsuserValidator catch block -->", error);
        return ValidationError(res, error, 'Invalid Request')

        // return res.status(400).json({ Success: false, message: "Invalid Request", error: error })
    }
}

