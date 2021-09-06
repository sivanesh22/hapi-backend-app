const tinyUrlController = require('../controllers/tinyUrl')


const generateTinyURL = {
    method: 'POST',
    path: '/generateTinyURL',
    handler: tinyUrlController.generateTinyURL,
    config: { auth: 'jwt' }
}

const redirectTinyUrl = {
    method: 'GET',
    path: '/{code}',
    handler: tinyUrlController.redirectTinyUrl,
    config: { auth: 'jwt' }
}



module.exports = [
    generateTinyURL,redirectTinyUrl
]