const Sequelize = require('sequelize')
const db = require('../config/database')
var User = db.define('userdetails', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    role_id: {
        type: Sequelize.INTEGER
    },
    account_id: {
        type: Sequelize.INTEGER
    }
}
    , {
        timestamps: false,
    }
);
module.exports = User;