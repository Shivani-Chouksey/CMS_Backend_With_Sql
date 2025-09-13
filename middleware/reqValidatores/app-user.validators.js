import joi from 'joi';
import { ValidationError } from '../../utils/response.js';


const schema = joi.object({
    role: joi.string().valid('investor', 'advisor', 'legal_entity').required("role is required").trim(),

})
const investor_advisor_schema = joi.object({
    role: joi.string().valid('investor', 'advisor', 'legal_entity').required("role is required").trim(),
    is_active: joi.boolean().optional().default(true),
    email: joi.string().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')).required('email is required'),
    user: joi.object({
        name: joi.string().required("name is required").trim(),

        mobile_number: joi.number().required('mobile_number is required'),
        address: joi.string().required(),
        access_group: joi.string().optional().valid('intermediate', 'advanced'),
        identity_proof: joi.object({
            id_type: joi.string().required().valid('pan_card', 'id_card'),
            id_number: joi.number().required(),
            // id_image:joi
        }).required(),
        address_proof: joi.object({
            card_issuance_date: joi.date().required(),
            card_number: joi.number().required(),
            // card_image: joi.number().required()
        }).required()
    }).required()
})


const legal_entity_schema = joi.object({
    role: joi.string().valid('investor', 'advisor', 'legal_entity').required("role is required").trim(),
    is_active: joi.boolean().optional().default(true),
    email: joi.string().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')).required('email is required'),
    company_detail: joi.object({
        company_name: joi.string().required(),
        company_incorporation_date: joi.date().required(),
        company_Id_number: joi.number().required(),
        address: joi.string().required(),
        company_Representative: joi.object({
            name: joi.string().required(),
            // email: joi.string().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')).required('email is required'),
            mobile_number: joi.number().required(),
            identity_proof: joi.object({
                id_type: joi.string().required().valid('pan_card', 'id_card'),
                id_number: joi.number().required(),
            }).required(),
            address_proof: joi.object({
                card_issuance_date: joi.date().required(),
                card_number: joi.number().required(),
                // card_image: joi.number().required()
            }).required()
        })
    }).required()
})



export const app_user_req_validator = async (req, res, next) => {
    try {
        if (req.body == undefined) {
            return ValidationError(res, 'Validation Error', 'Request body cannot be empty.')
        }
        console.log("app_user_req_validator", req.body);

        if (!req.body.role || req.body.role == undefined) {
            return ValidationError(res, 'Validation Error', 'Invalid Request Error- Role is Required')
        }
        if (req.body.role === 'investor' || req.body.role === 'advisor') {
            const { error, value } = await investor_advisor_schema.validate(req.body)
            if (error) {
                return ValidationError(res, error?.details[0].message, 'Invalid Request Error')
            }
            req.body = value
            next()
        }
        if (req.body.role === 'legal_entity') {
            const { error, value } = await legal_entity_schema.validate(req.body)
            if (error) {
                return ValidationError(res, error?.details[0].message, 'Invalid Request Error')
            }
            req.body = value
            next()
        }
    } catch (error) {
        console.log("app_user_req_validator", error);
        return ValidationError(res, error, 'Invalid Request Error')
    }
}


