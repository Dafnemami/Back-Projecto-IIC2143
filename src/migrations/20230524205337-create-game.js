/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      round: {
        type: Sequelize.INTEGER,
      },
      player1: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: true,
      },
      player2: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: true,
      },
      player3: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: true,
      },
      player4: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: true,
      },
      player5: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: true,
      },
      player6: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: true,
      },
      done: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Games');
  },
};
