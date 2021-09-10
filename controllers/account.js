const UserModal = require('../models/User');
const AccountModal = require('../models/Account');
const RoleModal = require('../models/Role');
const dashboard = './screens/dashboard.html';
const { createToken } = require('../authentication/Token')
const sequelize = require('../config/database');
// const redis = require("redis");
// const config = require('config')
// const client = redis.createClient(config.get('redis.port'));
const redis = require('../redis/Redis')


async function saveAccountandUser(request, reply) {
    let userData = {};
    var account_id = '';
    var userId;
    if (request) {
        userData = { ...request.payload }
        try {
            await sequelize.transaction(async (t) => {
                const acc = await AccountModal.create({ accountName: userData.account }, { transaction: t });
                account_id = acc.dataValues.id;
                await RoleModal.bulkCreate(
                    [{
                        roleName: 'Account Owner', accountId: account_id
                    },
                    { roleName: 'Admin', accountId: account_id },
                    {
                        roleName: 'User', accountId: account_id
                    }]
                    , { transaction: t });
                const role = await RoleModal.findAll({
                    attributes: ['id'],
                    where: {
                        roleName: 'Account Owner',
                        accountId: account_id,
                    }, transaction: t
                })
                userId = role[0].dataValues.id;
                await UserModal.create({
                    userName: userData.username, phone: userData.phone,
                    email: userData.email, password: userData.password, accountId: account_id,
                    roleId: role[0].dataValues.id
                }, { transaction: t })
            })
        } catch (err) {
            console.log(err, 'error in signup transaction')
        }

        const userDetails = {
            email: userData.email,
            accountId: account_id,
            id: userId,
            username: userData.username
        }
        redis.insertData(userData.email, JSON.stringify(userDetails))

        const token = await createToken(request.payload.email);
        const cookie_options = {
            ttl: 1 * 24 * 60 * 60 * 1000, // expires after a day
            encoding: 'none',
            isSecure: true,
            isHttpOnly: true,
            clearInvalid: false,
            strictHeader: true,
            isSameSite: false,
            path: '/',
        }
        let data = {
            isCredentialValid: true,
            userDetails,
            c1: token,
        };
        reply(data).header("Authorization", token).state("token", token, cookie_options);

    }
}

module.exports = {
    saveAccountandUser
}


