const UserModal = require('../models/User');
const { authenticate } = require('../authentication/Token')

function addUser(request, reply) {
    let userData = {};
    let validateAuth = authenticate();
    console.log(validateAuth, 'validateAuth')
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 2;
        userData.account_id = +userData.account_id;
        const addUser = UserModal.create({
            username: userData.username,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
            account_id: userData.account_id,
            role_id: userData.role_id
        });
        addUser.then(d => {
            console.log('Success')
        })
    }
}



module.exports = {
    addUser
}