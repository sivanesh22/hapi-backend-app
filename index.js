'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const server = new Hapi.Server();
const db = require('./config/database');
const Routes = require('./routes/index')
const config = require('config');
const secret = require('./config/config');

db.authenticate().then(() => console.log('Database connected in postgres')).catch(err => console.log('Error in connection' + err));



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


// 

server.register(Inert, (err) => {
    if (err) {
        console.log('Error in Inert');
    }

    server.register(require('hapi-auth-jwt'), (err) => {
        if (err) {
            console.log('Error in Inert');
        }
        server.auth.strategy('jwt', 'jwt', 'required', {
            key: secret,
            verifyOptions: { algorithms: ['HS256'] }
        });


        Routes.forEach(data => {
            server.route(data)
        })

    });

});
