const UserModal = require('../models/User');
const redis = require('../redis/Redis')
var bcrypt = require('bcryptjs');

async function generateUserInfo(email) {
    let userData = ''
    try {
        userData = await redis.fetchData(email);
    } catch (err) {
        console.error(err, 'Error in fetching user details');
    }
    if (userData) {
        return JSON.parse(userData)
    } else {
        try {
            const userInfo = await UserModal.findOne({
                attributes: ['userName', 'accountId', 'email', 'id'],
                where: {
                    email: email,
                }
            });
            await redis.insertData(email, JSON.stringify(userInfo.dataValues))
            return userInfo.dataValues
        } catch (err) {
            console.error(err, 'Error in fetching user details');
        }
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


async function checkPassword(password,dbPassword) {
    try {
        const isPasswordValid = await bcrypt.compare(password,dbPassword);
        return isPasswordValid
    } catch (e) {
        console.error(e, 'Hashing password failed');
    }


    return hash
}


module.exports = {
    generateUserInfo,
    encrypyPassword,
    checkPassword
}
