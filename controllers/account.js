const UserModal = require('../models/User');
const AccountModal = require('../models/Account');
const RoleModal = require('../models/Role');
const { createToken } = require('../authentication/Token')
const sequelize = require('../config/database');
const redis = require('../redis/Redis');
const { encrypyPassword } = require('../helpers/helpers');
const { cookie_options, accountOwnerRoleName, adminRoleName, userRoleName } = require('../config/Constants');


async function saveAccountandUser(request, reply) {
    let userData = {};
    let account_id = '';
    let userId;
    userData = request.payload;
    try {
        userData.password = await encrypyPassword(userData.password);
        await sequelize.transaction(async (t) => {
            const acc = await AccountModal.create({ accountName: userData.account }, { transaction: t });
            account_id = acc.id;
            await RoleModal.bulkCreate(
                [{
                    roleName: accountOwnerRoleName, accountId: account_id
                },
                { roleName: adminRoleName, accountId: account_id },
                {
                    roleName: userRoleName, accountId: account_id
                }]
                , { transaction: t });
            const role = await RoleModal.findOne({
                attributes: ['id'],
                where: {
                    roleName: accountOwnerRoleName,
                    accountId: account_id,
                }, transaction: t
            })
            userId = role.id;
            await UserModal.create({
                userName: userData.username, phone: userData.phone,
                email: userData.email, password: userData.password, accountId: account_id,
                roleId: role.id
            }, { transaction: t })
        })
        const userDetails = {
            email: userData.email,
            accountId: account_id,
            id: userId,
            username: userData.username
        }
        await redis.insertData(userData.email, JSON.stringify(userDetails))
        const token = await createToken(request.payload.email);
        let data = {
            isCredentialValid: true,
            userDetails,
            c1: token,
        };
        reply(data).state("token", token, cookie_options);
    } catch (err) {
        reply({
            errorMsg:'Error in creating account'
        }).code(500);
        console.log(err, 'error in signup controller')
    }

}

module.exports = {
    saveAccountandUser
}


