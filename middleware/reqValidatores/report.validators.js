import joi from 'joi';
import { RemoveFile } from '../../utils/helpers.js';

export const Report_Req_Validator = async (req, res, next) => {
    try {

        const schema = joi.object({
            name: joi.string().required('Name Is Required').trim(),
            date: joi.date().required(),
            compniesId: joi.array().required(),
            role: joi.array().items(joi.string().valid('advisor', 'investor', 'legal_entity')).required(''),
            access_group: joi.string().required().valid('intermediate', 'advanced')

        })
        if (req.body == undefined) {
            return res.status(400).json({ Success: false, message: 'Request body cannot be empty.' });
        }
        req.body = { ...req.body, role: JSON.parse(req.body.role), compniesId: JSON.parse(req.body.compniesId) }
        console.log('Report_Req_Validator', req.body);

        const { error, value } = await schema.validate(req.body);
        if (error) {
            if (req.file || req.file != undefined) {
                await RemoveFile(req.file?.path)
            }

            return res.status(400).json({ Success: false, message: "Invalid Request", error: error?.details[0].message })
        }
        // req.body = value
        next()
    } catch (error) {
        if (req.file || req.file != undefined) {
            await RemoveFile(req.file?.path)
        }
        return res.status(400).json({ Success: false, message: "Invalid Request", error: error })
    }
}