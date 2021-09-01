const Joi = require('joi');

const accountController = require('../controllers/account');

const saveAccountandUser={
    method: 'POST',
    config: {
        validate: {
            payload:
                Joi.object({
                    username: Joi.string().required(),
                    phone: Joi.number().required(),
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                    account: Joi.string().required()
                })
        }
    },
    path: '/saveAccountandUser',
    handler: accountController.saveAccountandUser 
};


module.exports=[
    saveAccountandUser
]
