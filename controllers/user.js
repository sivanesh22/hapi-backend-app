const UserModal = require('../models/User');
const RoleModal = require('../models/Role');
const { userRoleName } = require('../config/Constants');
const { generateUserInfo, encrypyPassword } = require('../helpers/helpers');
const redis = require('../redis/Redis')

async function addUser(request, reply) {
    const email = request.auth.credentials.email;
    try {
        let userInfo = await generateUserInfo(email);
        let userData = {};
        userData = request.payload;
        userData.password = await encrypyPassword(request.payload.password);
        userData.accountId = userInfo.accountId;
        let data = []
        data = await RoleModal.findOne({
            attributes: ['id'],
            where: {
                roleName: userRoleName,
                accountId: userInfo.accountId,
            }
        });
        userData.id = data.id;
        await UserModal.create({
            userName: userData.username,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
            accountId: userData.accountId,
            roleId: userData.id
        });

        await redis.insertData(userData.email, JSON.stringify(userData))
        reply({
            userCreated: true
        })
    } catch (e) {
        console.error(e, 'Unable to add user to the account');
        reply({
            userCreated: false
        }).code(500);
    }

}




module.exports = {
    addUser
}