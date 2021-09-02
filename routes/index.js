const loginRoutes = require('./login');
const accountRoutes = require('./account');
const userRoutes = require('./user');

module.exports=[
    ...loginRoutes,...accountRoutes,...userRoutes
]