const loginRoutes = require('./login');
const accountRoutes = require('./account');
const userRoutes = require('./user');
const tinyUrlRoutes = require('./tinyUrl')

module.exports=[
    ...loginRoutes,...accountRoutes,...userRoutes,...tinyUrlRoutes
]