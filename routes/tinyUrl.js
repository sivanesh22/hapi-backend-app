const tinyUrlController = require('../controllers/tinyUrl')


const generateTinyURL = {
    method: 'POST',
    path: '/generateTinyURL',
    handler: tinyUrlController.generateTinyURL,
    config: { auth: 'jwt' }
}

const redirectTinyUrl = {
    method: 'GET',
    path: '/tinyurl/{code}',
    handler: tinyUrlController.redirectTinyUrl,
    config: { auth: 'jwt' }
}


const fetchAllUrl = {
    method: 'GET',
    path: '/fetchAllUrl',
    config: { auth: 'jwt' },
    handler: tinyUrlController.fetchAllUrl
}


const removeTinyUrl = {
    method: 'POST',
    path: '/removeTinyUrl',
    config: { auth: 'jwt' },
    handler: tinyUrlController.removeTinyUrl
}


module.exports = [
    generateTinyURL,redirectTinyUrl, fetchAllUrl, removeTinyUrl
]