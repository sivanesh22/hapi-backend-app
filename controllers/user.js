const UserModal = require('../models/User');

async function addUser(request, reply) {
    let userData = {};
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 1;
        userData.account_id = +userData.account_id;
        try {
            await UserModal.create({
                userName: userData.username,
                phone: userData.phone,
                email: userData.email,
                password: userData.password,
                accountId: userData.account_id,
                roleId: userData.role_id
            });
        } catch (e) {
            // console.error(e, 'Unable to add user to the account');
        }
        console.log('Success')
    }
}



module.exports = {
    addUser
}