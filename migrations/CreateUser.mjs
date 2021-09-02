// const sequelize = require('sequelize');
export const up = async ({ context: { sequelize, DataTypes } }) => {
	console.log('ll')
	await sequelize.getQueryInterface().createTable('users', {
		id: {
			type: DataTypes.INTEGER,
			allow: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allow: false,
		},
	});
};

export const down = async ({ context: { sequelize } }) => {
	await sequelize.getQueryInterface().dropTable('users');
};