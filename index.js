'use strict';
const Hapi = require('hapi');
const ejs = require('ejs');
const server = new Hapi.Server();
const db = require('./config/database');
const Routes = require('./routes/index')
// const { secret } = require('./config/config');
// const UserModal = require('./models/User');
const { strategy } = require('./strategy/strategy');
const serverData=require('./config/default.json');
const plugin=require('./plugins/Plugins');

    (async function () {
        try {
            await db.authenticate();
            console.log('Database connected in postgres')
        } catch (e) {
            console.error(e, 'database connection failed');
        }

        server.connection({
            port: serverData.server.port,
            host: serverData.server.host
        });

        server.start(function (err) {
            if (err) {
                console.log('Error in start', err);
            }
            console.log('Server started at: ', server.info.uri);
        });

        await server.register(plugin);

        server.views({
            engines: { html: ejs },
            path: __dirname
        });
        server.auth.strategy('jwt','jwt',strategy());

        server.auth.default('jwt');

        Routes.forEach(data => {
            server.route(data)
        })

    })();