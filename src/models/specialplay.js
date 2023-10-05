const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpecialPlay extends Model {
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
      this.belongsTo(models.SpecialCard, {
        foreignKey: 'card',
      });
    }
  }
  SpecialPlay.init(
    {
      round: DataTypes.INTEGER,
      game: DataTypes.INTEGER,
      user: DataTypes.INTEGER,
      card: DataTypes.INTEGER,
      row: DataTypes.INTEGER,
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
      modelName: 'SpecialPlay',
    },
  );
  return SpecialPlay;
};
