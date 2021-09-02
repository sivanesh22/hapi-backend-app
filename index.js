'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const ejs = require('ejs');
const server = new Hapi.Server();
const db = require('./config/database');
const Routes = require('./routes/index')
const vision = require('vision');
const secret = require('./config/config');

(async function () {
    try {
        await db.authenticate();
        console.log('Database connected in postgres')
    } catch (e) {
        console.error(e,'database connection failed');
    }
})();

// db.authenticate().then(() => console.log('Database connected in postgres')).catch(err => console.log('Error in connection' + err));



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

server.register(vision, (err) => {
    if (err) {
        throw err;
    }
    server.views({
        engines: { html: ejs },
        path: __dirname
    });

    // server.route({
    //     method: 'GET',
    //     path: '/',
    //     handler: (request, reply) => {
    //         return reply.view('./screens/index.html', { title: 'Home page' });
    //     }
    // });
    server.register(Inert, (err) => {
        if (err) {
            console.log('Error in Inert');
        }

        server.register(require('hapi-auth-jwt'), (err) => {
            if (err) {
                console.log('Error in Inert');
            }
            server.auth.strategy('jwt', 'jwt', {
                key: secret,
                verifyOptions: { algorithms: ['HS256'] },
                validateFunction: {

                }
            });


            Routes.forEach(data => {
                server.route(data)
            })

        });

    });

})

