
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');

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
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
//   storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
    console.log('caled',umzug.up)
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  await umzug.up();
})();