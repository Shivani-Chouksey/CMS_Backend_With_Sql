export const CreateAppUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { role, user, company_detail, email, is_active } = req.body;
    const createdBy = req.user?.id;

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
    await transaction.rollback();
    console.error("CreateAppUser error -->", error);

    if (error.name === "SequelizeValidationError") {
      return ServerError(res, "Validation Error", error.errors[0]?.message);
    }
    return ServerError(res, "Internal Server Error", error.message || error);
  }
};                console.log("addres-->", addres);

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
