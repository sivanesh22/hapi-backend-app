const loginController = require('../controllers/login')

const signup = {
    method: 'GET',
    path: '/signup',
    handler: loginController.signup
}

const home = {
    method: 'GET',
    path: '/',
    handler: loginController.signup
}

const login = {
    method: 'GET',
    path: '/login',
    config: {
        handler: loginController.signup,
        // auth: {
        //     strategy: 'jwt',
        // },
    }
}

const validateLogin = {
    method: 'POST',
    path: '/validateLogin',
    handler: loginController.validateLogin
};


module.exports = [
    signup, login, validateLogin,home
]