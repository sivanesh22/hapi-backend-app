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
    // client.setex('hello', 3600, 'email');
    // const a = await fetchRedisStoreData('hello')
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

        const token = await createToken(request.payload.email);
        const cookie_options = {
            ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
            encoding: 'none',    // we already used JWT to encode
            isSecure: true,      // warm & fuzzy feelings
            isHttpOnly: true,    // prevent client alteration
            clearInvalid: false, // remove invalid cookies
            strictHeader: true   // don't allow violations of RFC 6265
        }
        redis.insertData('email',request.payload.email)
        redis.insertData('accountId',account_id)
        redis.insertData('userId',userId)
        redis.insertData('username',userData.username)
        reply.view(dashboard, {
            username: request.payload.username,
            account_id: account_id,
        }).header("Authorization", token)
            .state("token", token, cookie_options);
        // }).catch(err => {
        //     console.log(err, 'error while navigating to dashboard after signup')
        // });

    }
}

module.exports = {
    saveAccountandUser
}


