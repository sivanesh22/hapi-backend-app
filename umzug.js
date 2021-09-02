
const Sequelize = require('sequelize');
const Umzug = require('umzug');
const JSONStorage = require('umzug/lib/storages/json');

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
  // storageOptions: { sequelize: sequelize , },
  logger: console,
});

(async () => {
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  try {
    await umzug.up();
  } catch (e) {
    console.error(e,'umzug function failed');
  }
})();