const loginPath = './screens/login.html';
const UserModal = require('../models/User');
const dashboard = './screens/dashboard.html';
const { createToken } = require('../authentication/Token')
const store = require('store');


function signup(request, reply) {
    reply.file(loginPath);
}

function login(request, reply) {
    reply.file(loginPath);
}

async function validateLogin(request, reply) {
    if (request) {
        let email = request.payload.email;
        let password = request.payload.password;
        var results = []
        try {
            results = await UserModal.findAll({
                attributes: ['password', 'username', 'account_id'],
                where: {
                    email: email
                }
            });
        } catch (e) {
            console.error(e, 'Unable to fetch account details');
        }
        const fetchedPass = results[0].dataValues.password;
        const fetchedEmail = results[0].dataValues.email;
        if (fetchedPass === password) {
            const token = createToken(fetchedEmail);
            console.log('token', token)
            // ejs.renderFile(dashboard, {
            //     username: data[0].dataValues.username,
            //     account_id: data[0].dataValues.account_id
            // }, {}, (err, str) => {
            //     reply(str).header('Content-Type','text/html');
            // })
            reply.view(dashboard, {
                username: data[0].dataValues.username,
                account_id: data[0].dataValues.account_id
            })
        }
    }
}

module.exports = {
    signup,
    login,
    validateLogin
}