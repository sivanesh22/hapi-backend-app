
'use strict';

const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
const store = require('store')

function createToken(user) {
    return jwt.sign({ email: user }, secret, { algorithm: 'HS256', expiresIn: "10h" });
}

function authenticate() {
    const value = store.get('token')
    jwt.verify(value.token, secret, (err, user) => {
        if (err) {
            return console.log('failed', err)
        }
        return console.log('success', user)
    });
}

module.exports = {
    createToken,
    authenticate
};
