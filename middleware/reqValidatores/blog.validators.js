import joi from 'joi'
import { RemoveFile } from '../../utils/helpers.js';
import { ValidationError } from '../../utils/response.js';

const schema = joi.object({
    title: joi.string().trim().required().messages({ 'string.base': `"title" should not empty`, 'any.required': `"title" is Required` }),
    content: joi.string().optional()
})

export const BlogReqValidator = async (req, res, next) => {
    try {
        if (req.body == undefined) {
            return ValidationError(res, 'Validation Error', 'Request body cannot be empty.')
        }
        const { error, value } = await schema.validate(req.body, { abortEarly: false });
        // console.log(error);

        if (error) {
            await RemoveFile(req.file?.path)
            return ValidationError(res, error.details[0].message, 'Invalid Request')
        }
        req.body = value
        next()
    } catch (error) {
        console.log("Blog_Req_Validator_error", error);
        return ValidationError(res, error, 'Invalid Request')
    }
}