const UserModal = require('../models/User');
const RoleModal = require('../models/Role');
const { userRoleName } = require('../config/Constants');
const { generateUserInfo, encrypyPassword } = require('../helpers/helpers');
const redis = require('../redis/Redis')

async function addUser(request, reply) {
    const email = request.auth.credentials.email;
    let userInfo = await generateUserInfo(email);
    let userData = {};
    userData = request.payload;
    userData.password = await encrypyPassword(request.payload.password);
    userData.accountId = userInfo.accountId;
    let data = []
    try {
        data = await RoleModal.findOne({
            attributes: ['id'],
            where: {
                roleName: userRoleName,
                accountId: userInfo.accountId,
            }
        });
    } catch (e) {
        console.error(e, 'Unable to find role id');
    }
    try {
        userData.id = data.id;
        await UserModal.create({
            userName: userData.username,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
            accountId: userData.accountId,
            roleId: userData.id
        });
    } catch (e) {
        console.error(e, 'Unable to add user to the account');
    }
    await redis.insertData(userData.email, JSON.stringify(userData))
    reply({
        userCreated: true
    })
}




module.exports = {
    addUser
}