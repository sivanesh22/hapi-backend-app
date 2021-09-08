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

    var results='';
    try {
        results = await UserModal.findOne({
            attributes: ['password', 'username', 'account_id', 'email'],
            where: {
                email: decoded.email
            }
        });
    } catch (e) {
        console.error(e, 'Failed to fetch user details');
        return callback(null, false);
    }
  
    if (results) {
        return callback(null, true);
    } else {
        return callback(null, false);
    }
};
module.exports = {
    strategy: strategy
}