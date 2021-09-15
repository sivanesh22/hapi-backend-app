const Sequelize = require('sequelize')
const db = require('../config/database')
var TinyUrl = db.define('tinyurl', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    originalUrl: {
        field: 'original_url',
        type: Sequelize.STRING,
    },
    tinyUrl: {
        field: 'tiny_url',
        type: Sequelize.STRING,
        unique: true
    },
    isActive: {
        field: 'is_active',
        type: Sequelize.BOOLEAN,
    },
    expiryDate: {
        field: 'expiry_date',
        type: Sequelize.DATE
    },
    userId: {
        field: 'user_id',
        type: Sequelize.INTEGER,
    },
    accountId: {
        field: 'account_id',
        type: Sequelize.INTEGER,
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE
    },
    deletedAt: {
        field: 'deleted_at',
        type: Sequelize.DATE
    }
}
    , {
        freezeTableName: true,
        hooks: {
            afterUpdate: (user, options) => {
                console.log(user, '-----1231')
                user.username = 'Toni';
            },
            afterCreate: (user, options) => {
                console.log(user, '-----1231')
                user.username = 'Toni';
            },
        }
    }
);

module.exports = TinyUrl;

