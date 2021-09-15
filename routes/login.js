const loginController = require('../controllers/login')

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
     validateLogin, logout
]