'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const config = require('config');
const server = new Hapi.Server();
const db = require('./config/database');
const Routes = require('./routes/index')


db.authenticate().then(() => console.log('Database connected in postgres')).catch(err => console.log('Error in connection'+err));

server.connection({
    port: config.get('server.port'), 
    host: config.get('server.host')
});

server.start(function (err) {
    if (err) {
        console.log('Error in start', err);
    }
    console.log('Server started at: ', server.info.uri);
});


server.register(Inert, (err) => {
    if (err) {
        console.log('Error in Inert');
    }

    server.route({ 
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            return reply.file('./screens/login.html', { title: 'Home page' });
        } 
    });
    Routes.forEach(data => {
        server.route(data)
    })
    
});
