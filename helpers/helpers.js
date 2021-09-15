const UserModal = require('../models/User');
const redis = require('../redis/Redis')
var bcrypt = require('bcryptjs');

async function generateUserInfo(email) {
    let userData = ''
    try {
        userData = await redis.fetchData(email);
        if (userData) {
            return JSON.parse(userData)
        } else {
            const userInfo = await UserModal.findOne({
                attributes: ['userName', 'accountId', 'email', 'id'],
                where: {
                    email: email,
                }
            });
            await redis.insertData(email, JSON.stringify(userInfo.dataValues))
            return userInfo.dataValues
        }
    } catch (err) {
        console.error(err, 'Error in generateUserInfo');
    }
}

async function encrypyPassword(pass) {
    try {
        const hash = await bcrypt.hash(pass, 10);
        return hash
    } catch (e) {
        console.error(e, 'Hashing password failed');
    }
}


async function checkPassword(password, dbPassword) {
    try {
        const isPasswordValid = await bcrypt.compare(password, dbPassword);
        return isPasswordValid
    } catch (e) {
        console.error(e, 'Hashing password failed');
    }
}


module.exports = {
    generateUserInfo,
    encrypyPassword,
    checkPassword
}
