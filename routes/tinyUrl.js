const tinyUrlController = require('../controllers/tinyUrl')


const generateTinyURL = {
    method: 'POST',
    path: '/generateTinyURL',
    handler: tinyUrlController.generateTinyURL,
    config: { auth: false }
}

const redirectTinyUrl = {
    method: 'GET',
    path: '/{code}',
    handler: tinyUrlController.redirectTinyUrl,
    config: { auth: false }
}



module.exports = [
    generateTinyURL,redirectTinyUrl
]