const UserModal = require('../models/User');
const AccountModal = require('../models/Account');
const dashboard = './screens/dashboard.html';
const { createToken } = require('../authentication/Token')


async function saveAccountandUser(request, reply) {
    let userData = {};
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 1;
        try {
            await AccountModal.create({ accountName: userData.account });
        } catch (e) {
            console.error(e,'Account creation failed');
        }
        var data = [];
        try {
            data = await AccountModal.findAll({
                attributes: ['id'],
                where: {
                    account_name: userData.account
                }
            });
        } catch (e) {
            console.error('Unable to locate account id when creating user in signup');
        }
        const account_id = data[0].dataValues.id;
        try {
            await UserModal.create({
                userName: userData.username, phone: userData.phone,
                email: userData.email, password: userData.password, accountId: account_id,
                roleId: userData.role_id
            });
        } catch (e) {
            console.error(e,'User creation failed');
        }

        const token = createToken(userData.email);
        const cookie_options = {
            ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
            encoding: 'none',    // we already used JWT to encode
            isSecure: true,      // warm & fuzzy feelings
            isHttpOnly: true,    // prevent client alteration
            clearInvalid: false, // remove invalid cookies
            strictHeader: true   // don't allow violations of RFC 6265
        }
        reply.view(dashboard, {
            username: userData.username,
            account_id: account_id
        }).header("Authorization", token)
            .state("token", token, cookie_options);
    }
}

module.exports = {
    saveAccountandUser
}

