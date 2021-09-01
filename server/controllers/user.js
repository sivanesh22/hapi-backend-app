const UserModal = require('../modals/User');

function addUser(request, reply) {
    let userData = {};
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 2;
        // pool.on('error', (err, client) => {
        //     console.error('Unexpected error on idle client', err)
        //     process.exit(-1)
        // });
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