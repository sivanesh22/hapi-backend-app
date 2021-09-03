const Joi = require('joi');

const accountController = require('../controllers/account');

const saveAccountandUser = {
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
    },
    handler: accountController.saveAccountandUser,
    auth: false,    
  },
  path: '/saveAccountandUser',
};

// const listAllUsers={
//   method: 'POST',
//   config: {
//       handler: accountController.listAllUsers 
//   },
//   path: '/listAllUsers',
// };


module.exports = [
  saveAccountandUser
]
