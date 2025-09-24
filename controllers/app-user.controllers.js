import { db, sequelize } from "../config/db-connection.js";
import { generateFourDigitOTP } from "../utils/generateOtp.js";
import { Created, NotFound, ServerError, Success, Unauthorized } from "../utils/response.js";
import { Send_Mail } from "../utils/sendEmail.js";
import jwt from 'jsonwebtoken'

// export const CreateAppUser = async (req, res) => {
//     const transaction = await sequelize.transaction();

//     try {
//         const { role, user, company_detail } = req.body
//         console.log('CreateAppUser', req.files);


//         let appUser;
//         switch (role) {
//             case 'legal_entity':
//                 console.log("inside legal");

//                 const company_detail_obj = { company_name: company_detail.company_name, email: req.body?.email, company_incorporation_date: company_detail.company_incorporation_date, company_Id_number: company_detail.company_Id_number, address: company_detail.address }
//                 const { company_Representative } = company_detail;
//                 const company_Representative_detail = { name: company_Representative.name, email: req.body?.email, mobile_number: company_Representative?.mobile_number }
//                 const { identity_proof, address_proof } = company_Representative
//                 appUser = await db.appUser.create({ role: req.body.role, created_by_id: req.user?.id, is_active: req.body?.is_active, email: req.body?.email }, { transaction });
//                 const legalEntity = await db.legalEntity.create({ ...company_detail_obj, profile_image: req.files?.profile_image[0]?.path, app_user_id: appUser.id }, { transaction });
//                 console.log('legalEntity -->', legalEntity);

//                 const companyRepresentative = await db.companyRepresentative.create({ ...company_Representative_detail, app_user_id: appUser.id, legal_entity_id: legalEntity?.id }, { transaction })
//                 console.log("companyRepresentative -->", companyRepresentative.id);

//                 const addres = await db.addressProof.create({ ...address_proof, card_image: req.files?.address_proof[0]?.path, company_representative_id: companyRepresentative?.id, legal_entity_id: legalEntity?.id, app_user_id: appUser.id }, { transaction })
//                 console.log("addres-->", addres);

//                 const identityRes = await db.identityProof.create({ ...identity_proof, id_image: req.files?.identity_proof[0]?.path, legal_entity_id: legalEntity?.id, app_user_id: appUser.id, company_representative_id: companyRepresentative?.id }, { transaction })
//                 console.log("identityRes-->", identityRes);

//                 return Created(res, null, `App User Created  For Role : ${role}`)
//                 break;

//             // case 'investor':
//             //     res.status(201).json({ message: 'App User Created -Investor', Success: true })

//             //     break
//             default:
//                 // const { identity_proof, address_proof } = user
//                 console.log("user", user);
//                 // console.log("proof -->", identity_proof, address_proof);
//                 const user_detail_obj = { name: user.name, email: req.body?.email, mobile_number: user.mobile_number, address: user.address, profile_image: user.profile_image, access_group: user.access_group };
//                 const investor_advisor_obj = user.identity_proof;
//                 const address_proof_obj = user.address_proof;

//                 appUser = await db.appUser.create({ role: req.body.role, created_by_id: req.user?.id, is_active: req.body?.is_active, email: req.body?.email }, { transaction });
//                 console.log("appUser", appUser);

//                 const investor_advisor = await db.investorAndAdvisor.create({ ...user_detail_obj, app_user_id: appUser.id, profile_image: req.files?.profile_image[0]?.path }, { transaction })
//                 console.log("investor_advisor", investor_advisor);

//                 await db.addressProof.create({ ...address_proof_obj, card_image: req.files?.address_proof[0]?.path, investor_advisor_id: investor_advisor.id, app_user_id: appUser.id }, { transaction })
//                 await db.identityProof.create({ ...investor_advisor_obj, id_image: req.files?.identity_proof[0]?.path, investor_advisor_id: investor_advisor.id, app_user_id: appUser.id }, { transaction })
//                 return Created(res, null, `App User Created  For Role : ${role}`)
//                 break;
//         }
//         await transaction.commit();
//         // return res.send("create")

//     } catch (error) {
//         await transaction.rollback();
//         console.log('CreateAppUser error -->', error);
//         if(error.name === 'SequelizeValidationError'){
//         return ServerError(res, 'Internal Server Error', error?.errors[0]?.message)
//         }
//         return ServerError(res, 'Internal Server Error', error)
//     }
// }

export const CreateAppUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { role, user, company_detail, email, is_active } = req.body; const createdBy = req.user?.id;

        console.log("CreateAppUser files -->", req.files);

        // 1. Create base appUser first
        const appUser = await db.appUser.create(
            { role, created_by_id: createdBy, is_active, email },
            { transaction }
        );

        let responseMessage = "";

        // 2. Role-wise branching
        if (role === "legal_entity") {
            console.log("Inside legal_entity creation flow");

            // Company Details
            const companyDetailObj = {
                company_name: company_detail.company_name,
                email,
                company_incorporation_date: company_detail.company_incorporation_date,
                company_Id_number: company_detail.company_Id_number,
                address: company_detail.address,
                profile_image: req.files?.profile_image?.[0]?.path,
                app_user_id: appUser.id,
            };

            const legalEntity = await db.legalEntity.create(companyDetailObj, { transaction });

            // Company Representative
            const rep = company_detail.company_Representative;
            const repObj = {
                name: rep.name,
                email,
                mobile_number: rep.mobile_number,
                app_user_id: appUser.id,
                legal_entity_id: legalEntity.id,
            };
            const companyRep = await db.companyRepresentative.create(repObj, { transaction });

            // Address Proof
            if (rep.address_proof) {
                await db.addressProof.create(
                    {
                        ...rep.address_proof,
                        card_image: req.files?.address_proof?.[0]?.path,
                        company_representative_id: companyRep.id,
                        legal_entity_id: legalEntity.id,
                        app_user_id: appUser.id,
                    },
                    { transaction }
                );
            }

            // Identity Proof
            if (rep.identity_proof) {
                await db.identityProof.create(
                    {
                        ...rep.identity_proof,
                        id_image: req.files?.identity_proof?.[0]?.path,
                        company_representative_id: companyRep.id,
                        legal_entity_id: legalEntity.id,
                        app_user_id: appUser.id,
                    },
                    { transaction }
                );
            }

            responseMessage = "App User Created for Role: legal_entity";

        } else if (["investor", "advisor"].includes(role)) {
            console.log(`Inside ${role} creation flow`);

            const userDetailObj = {
                name: user.name,
                email,
                mobile_number: user.mobile_number,
                address: user.address,
                access_group: user.access_group,
                app_user_id: appUser.id,
                profile_image: req.files?.profile_image?.[0]?.path,
            };

            const investorAdvisor = await db.investorAndAdvisor.create(userDetailObj, { transaction });

            // Address Proof
            if (user.address_proof) {
                await db.addressProof.create(
                    {
                        ...user.address_proof,
                        card_image: req.files?.address_proof?.[0]?.path,
                        investor_advisor_id: investorAdvisor.id,
                        app_user_id: appUser.id,
                    },
                    { transaction }
                );
            }

            // Identity Proof
            if (user.identity_proof) {
                await db.identityProof.create(
                    {
                        ...user.identity_proof,
                        id_image: req.files?.identity_proof?.[0]?.path,
                        investor_advisor_id: investorAdvisor.id,
                        app_user_id: appUser.id,
                    },
                    { transaction }
                );
            }

            responseMessage = `App User Created for Role: ${role}`;

        } else {
            throw new Error(`Invalid role: ${role}`);
        }

        await transaction.commit();
        return Created(res, null, responseMessage);
    } catch (error) {
        console.log("CreateAppUser Error", error.name);

        await transaction.rollback();
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return ServerError(res, "Internal Server Error", messages);
        }
        return ServerError(res, "Internal Server Error", error.message || error);
    }
};



export const GetAllAppUser = async (req, res) => {
    try {
        let { limit, page } = req.query;

        // Convert to numbers if present
        limit = limit ? parseInt(limit) : null;
        page = page ? parseInt(page) : null;

        let queryOptions = {
            include: [
                { model: db.cmsUser, attributes: ['id', 'role', 'userName'] },
                { model: db.legalEntity, include: [{ model: db.companyRepresentative, include: [{ model: db.identityProof }, { model: db.addressProof }] }] },
                { model: db.investorAndAdvisor, include: [{ model: db.identityProof }, { model: db.addressProof }] },
            ]
        }

        if (limit && page) {
            const skip = (page - 1) * limit;
            queryOptions.limit = limit;
            queryOptions.offset = skip;
        }
        const response = await db.appUser.findAll(queryOptions);
        const totalRecordCount = await db.appUser.count();

        const pagination = limit && page
            ? {
                page,
                limit,
                totalRecord: totalRecordCount,
                totalPages: Math.ceil(totalRecordCount / limit)
            }
            : null;


        return Success(res, { data: response, pagination }, "All User ")
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const GetAppUserDetail = async (req, res) => {
    try {
        const responseData = await db.appUser.findOne({
            where: { id: req.params.id }, include: [
                { model: db.cmsUser, attributes: ['id', 'role', 'userName'] },
                { model: db.legalEntity, include: [{ model: db.companyRepresentative, include: [{ model: db.identityProof }, { model: db.addressProof }] }] },
                { model: db.investorAndAdvisor, include: [{ model: db.identityProof }, { model: db.addressProof }] },
            ]
        })
         if (!responseData || responseData == undefined || responseData == null) {
            return NotFound(res, "User Not Found")
        }
        return Success(res, responseData, "User Detail ")
    }
    catch (error) {
        return ServerError(res, 'Internal Server Error', error)

    }
}

export const AppUserLogin = async (req, res) => {
    try {
        console.log("AppUserLogin", req.body);

        const isUserExist = await db.appUser.findOne({ where: { email: req.body.email } });
        console.log("isUserExist", isUserExist);

        if (!isUserExist || isUserExist == undefined || isUserExist == null) {
            return NotFound(res, "User Not Found")
        }
        // generate random 4-digit OTP
        const random_otp = generateFourDigitOTP()
        const otp_options = {
            user: req.body.email,
            subject: "Login OTP ",
            otp: random_otp,
            body: `<h1>Login OTP  - ${random_otp}</h2>` // can add email template also 
        }
        await Send_Mail(otp_options);

        // update otp and otp_expiry_time in db
        const otp_expiry_time = new Date(new Date().getTime() + 5 * 60000); // current time + 10 minutes
        isUserExist.otp = random_otp;
        isUserExist.otp_expiry_time = otp_expiry_time;
        await isUserExist.save();
        return Success(res, '"OTP Sent Successfully on Registered Email" ')
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error)

    }
}

export const VerifyLoginOtp = async (req, res) => {
    try {
        console.log("VerifyLoginOtp", req.body.otp, req.body.email);
        const isUserExist = await db.appUser.findOne({
            where: { email: req.body.email, otp: req.body.otp },
            attributes: {
                exclude: ['refresh_token', 'otp_expiry_time', 'otp']
            }
        });
        if (!isUserExist || isUserExist == undefined || isUserExist == null) {
            return NotFound(res, "Invalid OTP or Email")
        }
        // check otp expiry time
        const current_time = new Date();
        if (isUserExist.otp_expiry_time < current_time) {
            return Unauthorized(res, "OTP Expired. Please login again to get new OTP")
        }

        const access_token = await jwt.sign({ id: isUserExist.id, role: isUserExist.role }, process.env.JWT_SECRET, { expiresIn: process.env.jWT_EXPIRY });
        const refresh_token = await jwt.sign({ id: isUserExist.id, role: isUserExist.role }, process.env.JWT_SECRET, { expiresIn: process.env.jWT_REFRESH_TOKEN_EXPIRY })
        // const access_token = await isUserExist.generateAccessToken();
        // const refresh_token = await isUserExist.generateRefreshToken();
        // console.log("access_token,refresh_token", access_token, refresh_token);
        // save refresh token in db against user
        isUserExist.refresh_token = refresh_token;
        isUserExist.otp = null;
        isUserExist.otp_expiry_time = null;
        await isUserExist.save();
        return Success(res, { id: isUserExist.id, role: isUserExist.role, is_active: isUserExist.is_active, email: isUserExist.email, access_token: access_token }, "Login Successful")
    } catch (error) {
        console.log("VerifyLoginOtp error", error);
        return ServerError(res, 'Internal Server Error', error)

    }
}

export const GetCurrentUser = async (req, res) => {
    try {
        const responseData = await db.appUser.findOne({
            where: { id: req.user.id }, attributes: ['id', 'role', 'is_active', 'email', 'createdAt', 'updatedAt'],
            include: [
                { model: db.cmsUser, attributes: ['id', 'role', 'userName'] },
                { model: db.legalEntity, include: [{ model: db.companyRepresentative, include: [{ model: db.identityProof, attributes: ['id', 'id_type', 'id_number', 'id_image', 'createdAt'] }, { model: db.addressProof, attributes: ['id', 'card_issuance_date', 'card_number', 'card_image', 'createdAt'] }] }] },
                { model: db.investorAndAdvisor, attributes: ['id', 'name', 'email', 'mobile_number', 'address', 'profile_image', 'access_group', 'createdAt'], include: [{ model: db.identityProof, attributes: ['id', 'id_type', 'id_number', 'id_image', 'createdAt'] }, { model: db.addressProof, attributes: ['id', 'card_issuance_date', 'card_number', 'card_image', 'createdAt'] }] },
            ]
        });
        return Success(res, responseData, "Current User Detail ")
    } catch (error) {
        return ServerError(res, 'Internal Server Error', error)
    }
}

export const UpdateAppUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    console.log("UpdateAppUser req.body", req.body);
    const userId = req.params.id
    try {
        //  check if user exist
        const isUserExist = await db.appUser.findOne({
            where: { id: req.params.id }, include: [
                { model: db.cmsUser, attributes: ['id', 'role', 'userName'] },
                { model: db.legalEntity, include: [{ model: db.companyRepresentative, include: [{ model: db.identityProof }, { model: db.addressProof }] }] },
                { model: db.investorAndAdvisor, include: [{ model: db.identityProof }, { model: db.addressProof }] },
            ]
        });
        if (!isUserExist || isUserExist === null || isUserExist === undefined) {
            return NotFound(res, `User Not Exist With this ID : ${req.params.id}`)
        }


        await db.appUser.update({ is_active: req.body?.is_active, email: req.body?.email }, { where: { id: userId }, transaction });

        if (isUserExist.role === 'investor' || isUserExist.role === 'advisor') {
            const { user } = req.body
            if (user) {
                await db.investorAndAdvisor.update({ ...user, profile_image: req.files?.profile_image && req.files?.profile_image[0]?.path }, { where: { app_user_id: userId }, transaction })
            }
            if (user.identity_proof) {
                await db.identityProof.update({ ...user.identity_proof, id_image: req.files?.identity_proof && req.files?.identity_proof[0]?.path }, { where: { app_user_id: userId }, transaction })
            }
            if (user.address_proof) {
                await db.addressProof.update({ ...user.address_proof, card_image: req.files?.address_proof && req.files?.address_proof[0]?.path }, { where: { app_user_id: userId }, transaction })
            }
        }
        if (isUserExist.role === 'legal_entity') {
            const { company_detail } = req.body
            if (company_detail) {
                await db.legalEntity.update({
                    ...company_detail, profile_image: req.files?.profile_image && req.files?.profile_image[0]?.path
                }, { where: { app_user_id: userId }, transaction })
            }
            if (company_detail.company_Representative) {
                await db.companyRepresentative.update({ ...company_detail.company_Representative }, { where: { app_user_id: userId }, transaction })
            }
            if (company_detail.company_Representative.address_proof) {
                await db.addressProof.update({ ...company_detail.company_Representative.address_proof, card_image: req.files?.address_proof && req.files?.address_proof[0]?.path }, { where: { app_user_id: userId }, transaction })
            }
            if (company_detail.company_Representative.identity_proof) {
                await db.identityProof.update({ ...company_detail.company_Representative.identity_proof, id_image: req.files?.identity_proof && req.files?.identity_proof[0]?.path }, { where: { app_user_id: userId }, transaction })
            }
        }
        await transaction.commit();
        return Success(res, null, `App User Update successfully (role :${isUserExist.role})`)
    } catch (error) {
        console.log('UpdateAppUser', error);
        return ServerError(res, 'Internal Server error', error.message)
    }
}