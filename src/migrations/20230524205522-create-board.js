/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Boards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      game: {
        type: Sequelize.INTEGER,
        references: { model: 'Games', key: 'id' },
      },
      row1: {
        type: Sequelize.STRING,
      },
      row2: {
        type: Sequelize.STRING,
      },
      row3: {
        type: Sequelize.STRING,
      },
      row4: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Boards');
  },
};
