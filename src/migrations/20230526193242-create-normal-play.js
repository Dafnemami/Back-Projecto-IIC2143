/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NormalPlays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      round: {
        type: Sequelize.INTEGER,
      },
      game: {
        type: Sequelize.INTEGER,
        references: { model: 'Games', key: 'id' },
      },
      user: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
      },
      card: {
        type: Sequelize.INTEGER,
        references: { model: 'NormalCards' },
      },
      row: {
        type: Sequelize.ENUM('1', '2', '3', '4'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NormalPlays');
  },
};
