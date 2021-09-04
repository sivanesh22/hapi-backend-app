const hapiAuthJwt= require('hapi-auth-jwt2')
const Inert = require('inert');
const vision = require('vision');

// module.exports={
//     a:1
// }


const secret = 'secretkey';
const tinyUrlLength = 6;

module.exports = [
    hapiAuthJwt,Inert,vision
]