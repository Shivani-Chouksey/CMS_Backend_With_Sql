import joi from 'joi'
import { RemoveFile } from '../../utils/helpers.js';
import { ValidationError } from '../../utils/response.js';

export const Create_News_Req_Validator = async (req, res, next) => {
    try {
        console.log('Create_News_Req_Validator -->', req.body, req.file);

        const schema = joi.object({
            title: joi.string().required('title is required').trim(),
            content: joi.string().optional().trim(),
            // news_poster: joi.object().optional()

        })
        const { error, value } = await schema.validate(req.body);
        if (error) {
            await RemoveFile(req.file?.path)
            return ValidationError(res, error?.details[0].message, 'Invalid Request')
        }
        req.body = value;
        next()
    } catch (error) {
        await RemoveFile(req.file?.path)
        return ValidationError(res, error, 'Invalid Request')

    }
}
