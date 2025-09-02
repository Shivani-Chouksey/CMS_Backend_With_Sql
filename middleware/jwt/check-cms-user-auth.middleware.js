import jwt from 'jsonwebtoken'
import { db } from '../../config/db-connection.js';

export const Is_Super_Admin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer', '').trim()
        // console.log("Is_Super_Admin Middleware token --->", token);
        if (!token || token == undefined) {
            return res.status(401).json({ Success: false, message: "Token Not Exists " });

        }
        const IsVerified = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log('IsVerified', IsVerified);
        if (!IsVerified) {
            return res.status(401).json({ Success: false, message: "UnAutheried Access" });

        }

        const { dataValues } = await db.cmsUser.findOne({ where: { id: IsVerified?.id } });
        // console.log("FoundUser", dataValues);

        const IsSuperAdmin = dataValues?.role === 'super-admin'

        if (!IsSuperAdmin) {
            return res.status(401).json({ Success: false, message: "UnAutheried Super-Admin Access", });
        }
        req.IsAdminRole = IsVerified.role
        next()
    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error });
    }
}


export const Is_Logged_In = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer', '').trim()
        console.log("Is_Logged_In Middleware token --->", token);
        if (!token || token == undefined) {
            return res.status(401).json({ Success: false, message: "Token Not Exists" });

        }
        const IsVerified = await jwt.verify(token, process.env.JWT_SECRET);
        console.log('IsVerified', IsVerified);
        if (!IsVerified) {
            return res.status(401).json({ Success: false, message: "UnAutheried Access" });

        }

        const { dataValues } = await db.cmsUser.findOne({ where: { id: IsVerified?.id } });
        console.log("FoundUser", dataValues);


        if (!dataValues) {
            return res.status(401).json({ Success: false, message: "UnAutheried Super-Admin Access", });
        }
        req.user = IsVerified
        next()
    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error });
    }
}


export const Is_Super_Admin_or_Admin = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.replace('Bearer', '').trim()
        // console.log("Is_Super_Admin Middleware token --->", token, token == undefined);
        if (!token || token == undefined) {
            return res.status(401).json({ Success: false, message: "Token Not Exists" });

        }
        const IsVerified = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log('IsVerified', IsVerified);
        if (!IsVerified) {
            return res.status(401).json({ Success: false, message: "UnAutheried Access" });

        }

        const { dataValues } = await db.cmsUser.findOne({ where: { id: IsVerified?.id } });
        // console.log("FoundUser", dataValues);

        const IsAutheried = dataValues?.role === 'super-admin' || dataValues?.role === 'admin'

        if (!IsAutheried) {
            return res.status(401).json({ Success: false, message: "UnAutheried  Access" });
        }
        req.user = IsVerified
        next()

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error", error: error });
    }
}
