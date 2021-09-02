const Sequelize = require('sequelize');
const up = async (sequelize) => {
	try {
		await sequelize.getQueryInterface().createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				allow: false,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allow: false,
			},
		});
	} catch (e) {
		console.error(e,'Account migration up failed');
	}
};

const down = async (sequelize) => {
	try {
		await sequelize.getQueryInterface().dropTable('users');
	} catch (e) {
		console.error(e,'Account migration down failed');
	}
};
module.exports = {
	up, down
}