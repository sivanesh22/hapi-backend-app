const loginRoutes = require('../routes/login');
const accountRoutes = require('../routes/account');
const userRoutes = require('../routes/user');

module.exports=[
    ...loginRoutes,...accountRoutes,...userRoutes
]