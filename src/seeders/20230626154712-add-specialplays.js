/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.bulkInsert('SpecialPlays', [
      {
        id: 0,
        round: 1,
        game: 0,
        user: 0,
        card: 1,
        row: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 1,
        round: 1,
        game: 0,
        user: 1,
        card: 2,
        row: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    queryInterface.bulkDelete('SpecialPlays', null, {});
  },
};
