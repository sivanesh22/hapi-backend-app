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


const logout = {
    method: 'GET',
    path: '/logout',
    handler: loginController.logout,
    config: { auth: 'jwt' },
};


module.exports = [
    signup, validateLogin, home, logout
]