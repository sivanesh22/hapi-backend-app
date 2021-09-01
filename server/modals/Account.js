const Sequelize = require('sequelize')
const db = require('../config/database')
var Account = db.define('accountdetails', {
    account_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    account_name: {
        type: Sequelize.STRING
    }
}
    , {
        timestamps: false,
    }
);
module.exports = Account;