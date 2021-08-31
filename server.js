'use strict';

const Hapi = require('hapi');
const { Pool } = require('pg');
let ejs = require('ejs');
const Inert = require('inert');
const constants = require('./constants');
const Joi = require('joi');
const { db_connect } = constants;

const server = new Hapi.Server();

const pool = new Pool({
    user: db_connect[0].user,
    host: db_connect[0].host,
    database: db_connect[0].database,
    port: db_connect[0].port,
});
const dashboard = './screens/dashboard.html';
const login = './screens/login.html';

server.connection({
    port: 5050,
    host: 'localhost'
});

server.start(function (err) {
    if (err) {
        console.log('Error in start', err);
    }
    console.log('Server started at: ', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        return reply("Welcome");
    }
});

server.register(Inert, (err) => {
    if (err) {
        console.log('Error in Inert');
    }

    server.route({
        method: 'GET',
        path: '/login',
        handler: function (request, reply) {
            reply.file(login);
        }
    });

    server.route({
        method: 'POST',
        path: '/validateLogin',
        handler: function (request, reply) {
            if (request) {
                let username = request.payload.username;
                let password = request.payload.password;
                ejs.renderFile(dashboard, { username: username }, {}, (err, str) => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        pool.on('error', (err, client) => {
                            console.error('Unexpected error on idle client', err)
                            process.exit(-1)
                        });
                        pool.connect((err, client, done) => {
                            if (err) throw err
                            done();
                            client.query(`SELECT password FROM userdetails where username = '${username}'`, (err, res) => {
                                if (err) {
                                    console.log('Error in retrieving data from accountdetails', err.stack);
                                } else {
                                    let fetchedPass = res.rows[0].password;
                                    if (password === fetchedPass) {
                                        console.log('Valid');
                                        reply(str).header('Content-Type', 'text/html');
                                    } else {
                                        console.log('Invalid credentials');
                                    }
                                }
                            });
                        });
                    }
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/signup',
        handler: function (request, reply) {
            reply.file(login);
        }
    });

    server.route({
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
            }
        },
        path: '/saveAccountandUser',
        handler: function (request, reply) {
            let userData = {};
            if (request) {
                userData = { ...request.payload }
                userData.role_id = 1;
                pool.on('error', (err, client) => {
                    console.error('Unexpected error on idle client', err)
                    process.exit(-1)
                });
                const accountQuery = 'INSERT INTO accountdetails(account_name) VALUES ($1)';
                const accountValues = [userData.account];
                pool.connect((err, client, done) => {
                    if (err) throw err
                    client.query(accountQuery, accountValues, (err, res) => {
                        done()
                        if (err) {
                            console.log('Error in inserting data in account Table', err.stack);
                            console.log('user name already exist')
                        } else {
                            console.log('Reaching account name', userData.account);
                            client.query(`SELECT account_id FROM accountdetails where account_name = '${userData.account}'`, (err, res) => {
                                if (err) {
                                    console.log('Error in retrieving data from account Table', err.stack);
                                } else {
                                    const account_id = res.rows[0].account_id;
                                    const userInsertQuery = 'INSERT INTO userdetails(username, phone, email, password, account_id, role_id) VALUES ($1, $2, $3, $4, $5, $6)'
                                    const insertValues = [userData.username, userData.phone, userData.email, userData.password, account_id, 1]
                                    client.query(userInsertQuery, insertValues, (err, res) => {
                                        if (err) {
                                            console.log('Error in inserting data in User Table', err.stack);
                                        } else {
                                            console.log('endd')
                                            ejs.renderFile(dashboard, { username: userData.username  }, {}, (err, str) => {
                                                reply(str).header('Content-Type', 'text/html');
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }
    });

});