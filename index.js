'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const ejs = require('ejs');
const server = new Hapi.Server();
const db = require('./config/database');
const Routes = require('./routes/index')
const vision = require('vision');
const secret = require('./config/config');
const UserModal = require('./models/User');

(async function () {
    try {
        await db.authenticate();
        console.log('Database connected in postgres')
    } catch (e) {
        console.error(e, 'database connection failed');
    }

    server.connection({
        port: 5050,
        host: "localhost"
    });


    server.start(function (err) {
        if (err) {
            console.log('Error in start', err);
        }
        console.log('Server started at: ', server.info.uri);
    });


    await server.register(vision)
    server.views({
        engines: { html: ejs },
        path: __dirname
    });
    await server.register(Inert)

    async function validate(decoded, request, callback) {
        const results = await UserModal.findAll({
            attributes: ['password', 'username', 'account_id', 'email'],
            where: {
                email: decoded.email
            }
        });
        if (results.length) {
            return callback(null, true);
        } else {
            return callback(null, false);
        }
    };

    await server.register(require('hapi-auth-jwt2'))
    server.auth.strategy('jwt', 'jwt', {
        key: secret,
        validateFunc: validate,
        verifyOptions: { algorithms: ['HS256'] },
    });

    server.auth.default('jwt');

    Routes.forEach(data => {
        server.route(data)
    })

})();