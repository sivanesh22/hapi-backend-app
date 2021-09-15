const UserModal = require('../models/User');
const { createToken } = require('../authentication/Token')
const redis = require('../redis/Redis');
const { checkPassword } = require('../helpers/helpers');
const { cookie_options } = require('../config/Constants');

async function validateLogin(request, reply) {
    let email = request.payload.email;
    let password = request.payload.password;
    let results;
    try {
        results = await UserModal.findOne({
            attributes: ['password', 'userName', 'accountId', 'email', 'id'],
            where: {
                email: email,
            }
        });
    } catch (e) {
        console.error(e, 'Unable to fetch account details');
    }
    const isPasswordValid = await checkPassword(password, results.password)
    const fetchedEmail = results.email;
    if (isPasswordValid) {
        const userDetails = {
            email: results.email,
            accountId: results.accountId,
            id: results.id,
            username: results.userName
        }
        await redis.insertData(results.email, JSON.stringify(userDetails))
        const token = createToken(fetchedEmail);
        let data = {
            isCredentialValid: true,
            userDetails,
            c1: token,
        };
        reply(data).header("Authorization", token).state("token", token, cookie_options);
    } else {
        reply({
            isCredentialValid: false,
            userDetails: {}
        })
    }
}

function logout(request, reply) {
    reply('logout').unstate('token');
}

module.exports = {
    validateLogin,
    logout
}