const hapiAuthJwt= require('hapi-auth-jwt2')
const Inert = require('inert');
const vision = require('vision');

module.exports = [
    hapiAuthJwt,Inert,vision
]