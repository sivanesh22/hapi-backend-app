const UserModal = require('../modals/User');
const AccountModal = require('../modals/Account');
let ejs = require('ejs');

function saveAccountandUser(request, reply) {
    let userData = {};
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 1;
        // pool.on('error', (err, client) => {
        //     console.error('Unexpected error on idle client', err)
        //     process.exit(-1)
        // });
        const createAccount = AccountModal.create({ account_name: userData.account });
        createAccount.then(d => {
            const results = AccountModal.findAll({
                attributes: ['account_id'],
                where: {
                    account_name: userData.account
                }
            });
            results.then(data => {
                const account_id = data[0].dataValues.account_id;
                const addUser = UserModal.create({
                    username: userData.username, phone: userData.phone,
                    email: userData.email, password: userData.password, account_id: account_id,
                    role_id: userData.role_id
                });
                addUser.then(d => {
                    ejs.renderFile(dashboard, { username: userData.username }, {}, (err, str) => {
                        reply(str).header('Content-Type', 'text/html');
                    })
                })

            })

        })
            .catch(err => {
                console.log(err, 'Error in creating the account')
            })
    }
}


module.exports = {
    saveAccountandUser
}