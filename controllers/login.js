const loginPath = './screens/login.html';
const UserModal = require('../models/User');
const { createToken } = require('../authentication/Token')
const redis = require('../redis/Redis')

async function signup(request, reply) {
    reply.file(loginPath);
    // reply({
    //     name: "siva"
    // })
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
                    email: email,
                    password: password,
                }
            });
        } catch (e) {
            console.error(e, 'Unable to fetch account details');
        }
        if (results.length) {
            const fetchedPass = results[0].dataValues.password;
            const fetchedEmail = results[0].dataValues.email;
            if (fetchedPass === password) {
                const userDetails = {
                    email: results[0].dataValues.email,
                    accountId: results[0].dataValues.account_id,
                    id: results[0].dataValues.id,
                    username: results[0].dataValues.username
                }
                redis.insertData(results[0].dataValues.email, JSON.stringify(userDetails))
                const token = createToken(fetchedEmail);
                const cookie_options = {
                    ttl: 1 * 24 * 60 * 60 * 1000, // expires after a day
                    encoding: 'none',
                    isSecure: true,
                    isHttpOnly: true,
                    clearInvalid: false,
                    strictHeader: true,
                    isSameSite: false,
                    path: '/',
                }
                let data = {
                    isCredentialValid: true,
                    userDetails,
                    c1: token,
                };
                reply(data).header("Authorization", token).state("token", token, cookie_options);

            }
        } else {
            reply({
                isCredentialValid: false,
                userDetails: {}
            })
        }
    }
}

function logout(request, reply) {
    reply('logout').unstate('token');
}

module.exports = {
    signup,
    login,
    validateLogin,
    logout
}

// "data", {
//     userId: results[0].dataValues.id,
//     accountId: results[0].dataValues.account_id,
//     username: results[0].dataValues.username,
//     userEmail: results[0].dataValues.email,
// }