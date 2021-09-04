const loginPath = './screens/login.html';
const UserModal = require('../models/User');
const dashboard = './screens/dashboard.html';
const { createToken } = require('../authentication/Token')


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
                attributes: ['password', 'username', 'account_id', 'email', 'id'],
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
            const cookie_options = {
                ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
                encoding: 'none',    // we already used JWT to encode
                isSecure: true,      // warm & fuzzy feelings
                isHttpOnly: true,    // prevent client alteration
                clearInvalid: false, // remove invalid cookies
                strictHeader: true   // don't allow violations of RFC 6265
            }
            reply.view(dashboard, {
                username: results[0].dataValues.username,
                account_id: results[0].dataValues.account_id
            }).header("Authorization", token)
                .state("token", token, cookie_options);
        }
    }
}

module.exports = {
    signup,
    login,
    validateLogin,
}

// "data", {
//     userId: results[0].dataValues.id,
//     accountId: results[0].dataValues.account_id,
//     username: results[0].dataValues.username,
//     userEmail: results[0].dataValues.email,
// }