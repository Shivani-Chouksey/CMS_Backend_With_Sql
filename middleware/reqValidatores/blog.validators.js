import joi from 'joi'
import { RemoveFile } from '../../utils/helpers.js';

const schema = joi.object({
    title: joi.string().trim().required().messages({ 'string.base': `"title" should not empty`, 'any.required': `"title" is Required` }),
    content: joi.string().optional()
})

export const BlogReqValidator = async (req, res, next) => {
    try {
        if (req.body == undefined) {
            return res.status(400).json({ Success: false, message: 'Request body cannot be empty.' });
        }
        const { error, value } = await schema.validate(req.body, { abortEarly: false });
        // console.log(error);

        if (error) {
            await RemoveFile(req.file?.path)
            return res.status(400).json({ Success: false, message: "Invalid Request", error: error.details[0].message })
        }
        req.body = value
        next()
    } catch (error) {
        console.log(error);

        return res.status(400).json({ Success: false, message: "Invalid Request Error", error: error })

    }
}