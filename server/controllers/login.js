const loginPath = './screens/login.html';
const UserModal = require('../models/User');
const dashboard = './screens/dashboard.html';
let ejs = require('ejs');

function signup(request, reply) {
    reply.file(loginPath);
}

function login(request, reply) {
    reply.file(loginPath);
}

function validateLogin(request, reply) {
    if (request) {
        let email = request.payload.email;
        let password = request.payload.password;
        const results = UserModal.findAll({
            attributes: ['password', 'username', 'account_id'],
            where: {
                email: email
            }
        });
        results.then(data => {
            const fetchedPass = data[0].dataValues.password;
            if (fetchedPass === password) {
                ejs.renderFile(dashboard, { username: data[0].dataValues.username, account_id: data[0].dataValues.account_id }, {}, (err, str) => {
                    reply(str).header('Content-Type', 'text/html');
                })
            }
        })
    }
}

module.exports = {
    signup,
    login,
    validateLogin
}