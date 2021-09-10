'use strict';
const Hapi = require('hapi');
const process = require('process')
const config = require('config')
const ejs = require('ejs');
const server = new Hapi.Server({ connections: {routes: { cors: {
    origin:['*'],
    credentials:true
} } }});
const db = require('./config/database');
const Routes = require('./routes/index')
const { strategy } = require('./strategy/strategy');
const plugin = require('./plugins/Plugins');

(async function () {
    try {
        await db.authenticate();
        console.log('Database connected in postgres')
    } catch (e) {
        console.error(e, 'database connection failed');
        process.exit()
    }

    server.connection({
        port: config.get('server.port'),
        host: config.get('server.host'),
    });

    try {
        await server.register(plugin);
    } catch (e) {
        console.error(e, 'server register failed');
    }

   

    server.views({
        engines: { html: ejs },
        path: __dirname
    });
    server.auth.strategy('jwt', 'jwt', strategy());

    server.auth.default('jwt');

    Routes.forEach(data => {
        server.route(data)
    })
  
    server.start(function (err) {
        if (err) {
            console.log('Error in start', err);
        }
        console.log('Server started at: ', server.info.uri);
    });


})();