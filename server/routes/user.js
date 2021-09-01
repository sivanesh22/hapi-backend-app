const Joi = require('joi');

const userController = require('../controllers/user')

const addUserToAccount ={
    method: 'POST',
    path: '/addUserToAccount',
    config: {
        validate: {
            payload:
                Joi.object({
                    username: Joi.string().required(),
                    phone: Joi.number().required(),
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                    account_id: Joi.number().required(),
                })
        }
    },
    handler: userController.addUser
};

module.exports=[
    addUserToAccount
]
