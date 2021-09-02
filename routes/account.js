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
        },
        handler: accountController.saveAccountandUser 
    },
    path: '/saveAccountandUser',
    // auth: {
    //     strategy: 'jwt',
    //   }
};

const a={
method: 'GET',
path: '/api/users',
config: {
  handler: (req, res) => {
    User
      .find()
      // Deselect the password and version fields
      .select('-password -__v')
      .exec((err, users) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        if (!users.length) {
          throw Boom.notFound('No users found!');
        }
        res(users);
      })
  },
  // Add authentication to this route
  // The user must have a scope of `admin`
 
}
}
module.exports=[
    saveAccountandUser
]
