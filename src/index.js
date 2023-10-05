const dotenv = require('dotenv');
const app = require('./app');
const orm = require('./models');

// Para variables de entorno
dotenv.config();

orm.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    app.listen(process.env.PUERTO, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${process.env.PUERTO}`);
      return app;
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
