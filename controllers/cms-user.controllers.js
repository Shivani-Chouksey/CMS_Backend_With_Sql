import { CmsUserSchema } from "../models/cms-user.model.js";

export const CreateCMSUser = async (req, res) => {
    try {
        const reponse = await CmsUserSchema.create(req.body);
        res.status(201).json({ Success: true, message: "CMS User Created Successfully", data: reponse });
    } catch (error) {
        res.status(500).json({ Success: false, message: "CMS User Creation Failed", error: error.errors[0].message });
    }
}