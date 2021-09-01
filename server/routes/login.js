const loginController = require('../controllers/login')

const signup = {
    method: 'GET',
    path: '/signup',
    handler: loginController.signup
}

const login = {
    method: 'GET',
    path: '/login',
    handler: loginController.signup
}

const validateLogin = {
    method: 'POST',
    path: '/validateLogin',
    handler: loginController.validateLogin
};


module.exports = [
    signup, login, validateLogin
]