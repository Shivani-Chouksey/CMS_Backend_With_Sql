

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

                return Created(res, null, `App User Created  For Role : ${role}`)
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
                return Created(res, null, `App User Created  For Role : ${role}`)
                break;
        }
        await transaction.commit();
        // return res.send("create")

    } catch (error) {
        await transaction.rollback();
        console.log('CreateAppUser error -->', error);
        if(error.name === 'SequelizeValidationError'){
        return ServerError(res, 'Internal Server Error', error?.errors[0]?.message)
        }
        return ServerError(res, 'Internal Server Error', error)
    }
}
