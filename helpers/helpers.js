const UserModal = require('../models/User');
const redis = require('../redis/Redis')

async function generateUserInfo(email) {
    let userData = ''
    try {
        userInfo = await redis.fetchData(email);
    } catch (err) {
        console.error(err, 'Error in fetching user details');
    }
    if (userData) {
        return JSON.parse(userData)
    } else {
        try {
            const userInfo = await UserModal.findOne({
                attributes: ['username', 'account_id', 'email', 'id'],
                where: {
                    email: email,
                }
            });
            userInfo.accountId = userInfo.dataValues.account_id;
            redis.insertData(email, JSON.stringify(userInfo.dataValues))
            return userInfo.dataValues
        } catch (err) {
            console.error(err, 'Error in fetching user details');
        }
    }
}

module.exports = {
    generateUserInfo
}
