import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise';
import { News } from "../models/news.model.js";
import { CmsUser } from "../models/cms-user.model.js";
import { Company } from "../models/company.model.js";
import { Blog } from "../models/blog.model.js";
import { AppUser } from "../models/app-user.model.js";
import { legal_entity } from "../models/legal-entity.model.js";
import { Investor_Advisor_User } from "../models/investor-advisor.model.js";
import { CompanyRepresentative } from "../models/company-representative.model.js";
import { AddressProof } from "../models/address-proof.model.js";
import { IdentityProof } from "../models/identity-proof.model.js";
// export const sequelize = new Sequelize(process.env.SQL_URI)
const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

export const db = {}

export const DbConnection = async () => {
    try {
        await mysql.createConnection({ host, user, password, database, pool: { max: 5, min: 0, idle: 10000 } });
        const sequelize = new Sequelize(database, user, password, {
            host: host, // or your remote IP
            dialect: "mysql",
            pool: { max: 5, min: 0, idle: 10000 },
            logging: false
        });
        await sequelize.authenticate();

        // init models and add them inside  exported db object
        db.cmsUser = CmsUser(sequelize);
        db.news = News(sequelize);
        db.company = Company(sequelize);
        db.blog = Blog(sequelize);
        db.appUser = AppUser(sequelize);
        db.legalEntity = legal_entity(sequelize);
        db.investorAndAdvisor = Investor_Advisor_User(sequelize);
        db.companyRepresentative = CompanyRepresentative(sequelize);
        db.addressProof = AddressProof(sequelize);
        db.identityProof = IdentityProof(sequelize)

        // Assosications - Table Relations
        // db.cmsUser.hasMany(db.news, { foreignKey: 'created_user_id' });
        db.news.belongsTo(db.cmsUser, { foreignKey: 'created_user_id' });
        db.blog.belongsTo(db.cmsUser, { foreignKey: 'created_user_id' });
        db.company.belongsTo(db.cmsUser, { foreignKey: 'created_by' });

        // appuser  Relations
        db.appUser.belongsTo(db.cmsUser, { foreignKey: 'created_by_id' });
        db.cmsUser.hasMany(db.appUser, { foreignKey: 'created_by_id' })

        db.legalEntity.belongsTo(db.appUser, { foreignKey: 'app_user_id' });
        db.appUser.hasOne(db.legalEntity, { foreignKey: 'app_user_id' });

        db.investorAndAdvisor.belongsTo(db.appUser, { foreignKey: 'app_user_id' });
        db.appUser.hasOne(db.investorAndAdvisor, { foreignKey: 'app_user_id' });

        //Company Representative relation
        db.companyRepresentative.belongsTo(db.legalEntity, { foreignKey: 'legal_entity_id' });
        db.legalEntity.hasOne(db.companyRepresentative, { foreignKey: 'legal_entity_id' });

        //identityProof Relation
        db.identityProof.belongsTo(db.companyRepresentative, { foreignKey: 'company_represtative_id' });
        db.companyRepresentative.hasOne(db.identityProof, { foreignKey: 'company_represtative_id' })
        //address proof relation
        db.addressProof.belongsTo(db.companyRepresentative, { foreignKey: 'company_represtative_id' });
        db.companyRepresentative.hasOne(db.addressProof, { foreignKey: 'company_represtative_id' })

        // investorAndAdvisor identityproof Relation
        db.identityProof.belongsTo(db.investorAndAdvisor, { foreignKey: 'investor_advisor_id' });
        db.investorAndAdvisor.hasOne(db.identityProof, { foreignKey: 'investor_advisor_id' })

        db.addressProof.belongsTo(db.investorAndAdvisor, { foreignKey: 'investor_advisor_id' });
        db.investorAndAdvisor.hasOne(db.addressProof, { foreignKey: 'investor_advisor_id' })

        await sequelize.sync({force:false});


        console.log("Database Connected Successfully")
    } catch (error) {
        console.log("Database Connection Failed ---> ", error)
    }
}