const tinyUrlController = require('../controllers/tinyUrl')


const generateTinyURL = {
    method: 'POST',
    path: '/generateTinyURL',
    // config: { auth: 'jwt' }
    config: {
        // validate: {
        //     payload:
        //         Joi.object({
        //             longUrl: Joi.string().required(),
        //         })
        // },
        handler: tinyUrlController.generateTinyURL,
        auth: 'jwt',
    },
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


const shareTinyUrlViaEmail = {
    method: 'POST',
    path: '/shareTinyUrlViaEmail',
    config: { auth: 'jwt' },
    handler: tinyUrlController.shareTinyUrlViaEmail
}

const removeTinyUrl = {
    method: 'POST',
    path: '/removeTinyUrl',
    config: { auth: 'jwt' },
    handler: tinyUrlController.removeTinyUrl
}


module.exports = [
    generateTinyURL, redirectTinyUrl, fetchAllUrl, removeTinyUrl, shareTinyUrlViaEmail
]