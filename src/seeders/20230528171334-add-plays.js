module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('NormalPlays', [
    {
      id: 0,
      round: 1,
      game: 0,
      user: 0,
      card: 11,
      row: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      round: 1,
      game: 0,
      user: 1,
      card: 23,
      row: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('NormalPlays', null, {}),
};
