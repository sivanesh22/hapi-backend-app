const Joi = require('joi');

const userController = require('../controllers/user')

const addUser ={
    method: 'POST',
    path: '/addUser',
    config: { auth: 'jwt' },
    handler: userController.addUser
};

module.exports=[
    addUser
]
