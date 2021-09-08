const loginController = require('../controllers/login')

const signup = {
    method: 'GET',
    path: '/signup',
    handler: loginController.signup,
    config: { auth: false }
}

const home = {
    method: 'GET',
    path: '/login',
    handler: loginController.signup,
    config: {
        auth: false,
        cors: true
    },

}

const login = {
    method: 'GET',
    path: '/',
    config: {
        // validate: {
        //     payload:
        //         Joi.object({
        //             email: Joi.string().required(),
        //             password: Joi.string().required(),
        //         })
        // },
        handler: loginController.signup,
        auth: false
    }
}

const validateLogin = {
    method: 'POST',
    path: '/validateLogin',
    handler: loginController.validateLogin,
    config: { auth: false }
};


module.exports = [
    signup, validateLogin, home
]