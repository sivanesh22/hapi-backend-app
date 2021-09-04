const UserModal = require('../models/User');
const AccountModal = require('../models/Account');
const RoleModal = require('../models/Role');
const dashboard = './screens/dashboard.html';
const { createToken } = require('../authentication/Token')
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');


async function saveAccountandUser(request, reply) {
    let userData = {};
    if (request) {
        userData = { ...request.payload }
        userData.role_id = 1;
        await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        }, async (t) => {
            // chain all your queries here. make sure you return them.
            return AccountModal.create({ accountName: userData.account }, { transaction: t }).then(acc => {
                const account_id = acc.dataValues.id;
                return RoleModal.bulkCreate(
                    [{
                        roleName: 'Account Owner', accountId: account_id
                    },
                    { roleName: 'Admin', accountId: account_id },
                    {
                        roleName: 'User', accountId: account_id
                    }]
                    , { transaction: t }).then(d => {
                        return RoleModal.findAll({
                            // attributes: ['id'],
                            where: {
                                // roleName: 'Account Owner',
                                // accountId: account_id,
                            }
                        }, { transaction: t }).then(role => {
                            return UserModal.create({
                                userName: userData.username, phone: userData.phone,
                                email: userData.email, password: userData.password, accountId: account_id,
                                roleId: d[0].id
                            }, { transaction: t })
                        })
                    })
            })
        }).then(result => {
            const token = createToken(result.dataValues.email);
            const cookie_options = {
                ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
                encoding: 'none',    // we already used JWT to encode
                isSecure: true,      // warm & fuzzy feelings
                isHttpOnly: true,    // prevent client alteration
                clearInvalid: false, // remove invalid cookies
                strictHeader: true   // don't allow violations of RFC 6265
            }
            reply.view(dashboard, {
                username: result.dataValues.userName,
                account_id: result.dataValues.accountId,
            }).header("Authorization", token)
                .state("token", token, cookie_options);
        }).catch(err => {
            console.log(err, 'error while navigating to dashboard after signup')
        });


        // try {
        //     await AccountModal.create({ accountName: userData.account }, { transaction: transaction });
        // } catch (e) {
        //     console.error(e, 'Account creation failed');
        //     await transaction.rollback();
        // }
        // var data = [];
        // try {
        //     data = await AccountModal.findAll({
        //         attributes: ['id1'],
        //         where: {
        //             account_name: 'userData.account'
        //         }
        //     }, { transaction: transaction });
        // } catch (e) {
        //     console.error('Unable to locate account id when creating user in signup');
        //     await transaction.rollback();
        // }
        // const account_id = data[0].dataValues.id;
        // try {
        //     await UserModal.create({
        //         userName: userData.username, phone: userData.phone,
        //         email: userData.email, password: userData.password, accountId: account_id,
        //         roleId: userData.role_id
        //     }, { transaction: transaction });
        //     await transaction.commit();
        // } catch (e) {
        //     console.error(e, 'User creation failed');
        //     await transaction.rollback();
        // }

       
    }
}

module.exports = {
    saveAccountandUser
}


