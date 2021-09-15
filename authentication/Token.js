
'use strict';
const jwt = require('jsonwebtoken');
const config = require('config');

function createToken(user) {
    return jwt.sign({ email: user }, config.get('tokenData.secret'), { algorithm: 'HS256', expiresIn: "10h" });
}

module.exports = {
    createToken,
};
