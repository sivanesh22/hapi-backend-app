const UserModal = require('../models/User');
const AccountModal = require('../models/Account');
const dashboard = './screens/dashboard.html';

async function saveAccountandUser(request, reply) {
    let userData = {};
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 1;
        try {
            await AccountModal.create({ account_name: userData.account });
        } catch (e) {
            console.error(e,'Account creation failed');
        }
        var data = [];
        try {
            data = await AccountModal.findAll({
                attributes: ['account_id'],
                where: {
                    account_name: userData.account
                }
            });
        } catch (e) {
            console.error(e,'Unable to locate account id when creating user in signup');
        }
        const account_id = data[0].dataValues.account_id;
        try {
            await UserModal.create({
                username: userData.username, phone: userData.phone,
                email: userData.email, password: userData.password, account_id: account_id,
                role_id: userData.role_id
            });
        } catch (e) {
            console.error(e,'User creation failed');
        }
        reply.view(dashboard, {
            username: userData.username,
            account_id: account_id
        })
    }
}

module.exports = {
    saveAccountandUser
}