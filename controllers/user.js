const UserModal = require('../models/User');

async function addUser(request, reply) {
    let userData = {};
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 2;
        userData.account_id = +userData.account_id;
        try {
            await UserModal.create({
                username: userData.username,
                phone: userData.phone,
                email: userData.email,
                password: userData.password,
                account_id: userData.account_id,
                role_id: userData.role_id
            });
        } catch (e) {
            console.error(e, 'Unable to add user to the account');
        }
        console.log('Success')
    }
}



module.exports = {
    addUser
}