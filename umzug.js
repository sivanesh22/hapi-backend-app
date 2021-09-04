
const Sequelize = require('sequelize');
const Umzug = require('umzug');
const JSONStorage = require('umzug/lib/storages/json');
const argv = require('process')
const sequelize = new Sequelize({
  dialect: 'postgres',
  storage: 'App',
  user: "sivanesh",
  host: "localhost",
  database: "App",
  password: "",
  port: 5432
});

const umzug = new Umzug({
  migrations: { path: './migrations/', pattern: /\.js$/, params: [sequelize] },
  context: sequelize.getQueryInterface(),
  storage: new JSONStorage,
  logger: console,
});

(async () => {
  try {
    let mode = argv.argv;
    mode = mode[mode.length - 1]
    if (mode == 'up') {
      await umzug.up();
    } else if (mode == 'down') {
      await umzug.down();
    }
  } catch (e) {
    console.error(e, 'umzug function failed');
  }
})();