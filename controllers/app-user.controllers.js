import { db, sequelize } from "../config/db-connection.js";
import { generateFourDigitOTP } from "../utils/generateOtp.js";
import { Send_Mail } from "../utils/sendEmail.js";
import jwt from 'jsonwebtoken'
export const CreateAppUser = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { role, user, company_detail } = req.body
        console.log('CreateAppUser', req.files);


        let appUser;
        switch (role) {
            case 'legal_entity':
                console.log("inside legal");

                const company_detail_obj = { company_name: company_detail.company_name, email: req.body?.email, company_incorporation_date: company_detail.company_incorporation_date, company_Id_number: company_detail.company_Id_number, address: company_detail.address }
                const { company_Representative } = company_detail;
                const company_Representative_detail = { name: company_Representative.name, email: req.body?.email, mobile_number: company_Representative?.mobile_number }
                const { identity_proof, address_proof } = company_Representative
                appUser = await db.appUser.create({ role: req.body.role, created_by_id: req.user?.id, is_active: req.body?.is_active, email: req.body?.email }, { transaction });
                const legalEntity = await db.legalEntity.create({ ...company_detail_obj, profile_image: req.files?.profile_image[0]?.path, app_user_id: appUser.id }, { transaction });
                console.log('legalEntity -->', legalEntity);

                const companyRepresentative = await db.companyRepresentative.create({ ...company_Representative_detail, app_user_id: appUser.id, legal_entity_id: legalEntity?.id }, { transaction })
                console.log("companyRepresentative -->", companyRepresentative.id);

                const addres = await db.addressProof.create({ ...address_proof, card_image: req.files?.address_proof[0]?.path, company_representative_id: companyRepresentative?.id, legal_entity_id: legalEntity?.id, app_user_id: appUser.id }, { transaction })
                console.log("addres-->", addres);

                const identityRes = await db.identityProof.create({ ...identity_proof, id_image: req.files?.identity_proof[0]?.path, legal_entity_id: legalEntity?.id, app_user_id: appUser.id, company_representative_id: companyRepresentative?.id }, { transaction })
                console.log("identityRes-->", identityRes);

                res.status(201).json({ message: `App User Created  For Role : ${role}`, Success: true })
                break;

            // case 'investor':
            //     res.status(201).json({ message: 'App User Created -Investor', Success: true })

            //     break
            default:
                // const { identity_proof, address_proof } = user
                console.log("user", user);
                // console.log("proof -->", identity_proof, address_proof);
                const user_detail_obj = { name: user.name, email: req.body?.email, mobile_number: user.mobile_number, address: user.address, profile_image: user.profile_image, access_group: user.access_group };
                const investor_advisor_obj = user.identity_proof;
                const address_proof_obj = user.address_proof;

                appUser = await db.appUser.create({ role: req.body.role, created_by_id: req.user?.id, is_active: req.body?.is_active, email: req.body?.email }, { transaction });
                console.log("appUser", appUser);

                const investor_advisor = await db.investorAndAdvisor.create({ ...user_detail_obj, app_user_id: appUser.id, profile_image: req.files?.profile_image[0]?.path }, { transaction })
                console.log("investor_advisor", investor_advisor);

                await db.addressProof.create({ ...address_proof_obj, card_image: req.files?.address_proof[0]?.path, investor_advisor_id: investor_advisor.id, app_user_id: appUser.id }, { transaction })
                await db.identityProof.create({ ...investor_advisor_obj, id_image: req.files?.identity_proof[0]?.path, investor_advisor_id: investor_advisor.id, app_user_id: appUser.id }, { transaction })
                res.status(201).json({ message: 'App User Created - investor_advisor', Success: true })

                break;
        }
        await transaction.commit();
        // return res.send("create")

    } catch (error) {
        await transaction.rollback();
        console.log('CreateAppUser error -->', error);
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })
    }
}


export const GetAllAppUser = async (req, res) => {
    try {
        const response = await db.appUser.findAll({
            include: [
                { model: db.cmsUser, attributes: ['id', 'role', 'userName'] },
                { model: db.legalEntity, include: [{ model: db.companyRepresentative, include: [{ model: db.identityProof }, { model: db.addressProof }] }] },
                { model: db.investorAndAdvisor, include: [{ model: db.identityProof }, { model: db.addressProof }] },
            ]
        });


        return res.status(500).json({ Success: true, message: "All User ", data: response })
    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

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
        return res.status(500).json({ Success: true, message: "User Detail ", data: responseData })

    }
    catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

    }
}

export const AppUserLogin = async (req, res) => {
    try {
        console.log("AppUserLogin", req.body);

        const isUserExist = await db.appUser.findOne({ where: { email: req.body.email } });
        console.log("isUserExist", isUserExist);

        if (!isUserExist || isUserExist == undefined || isUserExist == null) {
            return res.status(404).json({ Success: false, message: "User Not Found" })
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
        return res.status(200).json({ Success: true, message: "OTP Sent Successfully on Registered Email" }); // remove otp from response in production

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

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
            return res.status(404).json({ Success: false, message: "Invalid OTP or Email" })
        }
        // check otp expiry time
        const current_time = new Date();
        if (isUserExist.otp_expiry_time < current_time) {
            return res.status(400).json({ Success: false, message: "OTP Expired. Please login again to get new OTP" })
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
        return res.status(200).json({ Success: true, message: "Login Successful", data: { id: isUserExist.id, role: isUserExist.role, is_active: isUserExist.is_active, email: isUserExist.email, access_token: access_token } }); // remove otp from response in production
    } catch (error) {
        console.log("VerifyLoginOtp error", error);

        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

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
        return res.status(200).json({ Success: true, message: "Current User Detail", data: responseData })

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error })

    }
}