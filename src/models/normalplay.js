const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NormalPlay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Game, {
        foreignKey: 'game',
      });
      this.belongsTo(models.User, {
        foreignKey: 'user',
      });
      this.belongsTo(models.NormalCard, {
        foreignKey: 'card',
      });
    }
  }
  NormalPlay.init(
    {
      round: DataTypes.INTEGER,
      game: DataTypes.INTEGER,
      user: DataTypes.INTEGER,
      card: DataTypes.INTEGER,
      row: DataTypes.ENUM('1', '2', '3', '4'),
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['user', 'game', 'round'],
        },
      ],
    },
    {
      sequelize,
      modelName: 'NormalPlay',
    },
  );
  return NormalPlay;
};
