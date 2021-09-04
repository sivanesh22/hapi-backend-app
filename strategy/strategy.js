const { secret } = require('../config/config');
const UserModal = require('../models/User');


function strategy() {
    return (('jwt', 'jwt', {
        key: secret,
        validateFunc: validate,
        verifyOptions: { algorithms: ['HS256'] },
    })) 
}

async function validate(decoded, request, callback) {
    const results = await UserModal.findAll({
        attributes: ['password', 'username', 'account_id', 'email'],
        where: {
            email: decoded.email
        }
    });
    if (results.length) {
        return callback(null, true);
    } else {
        return callback(null, false);
    }
};
module.exports = {
    strategy:strategy
}