const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      id: 0,
      password: bcrypt.hashSync('password', 10),
      username: 'Alberto',
      email: 'alberto.agostini@uc.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      password: bcrypt.hashSync('password', 10),
      username: 'Dafne',
      email: 'dafne.arriagada@uc.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      password: bcrypt.hashSync('password', 10),
      username: 'Hernan',
      email: 'hernan.cabrera@uc.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
