const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCard extends Model {
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
    }
  }
  UserCard.init(
    {
      hand: DataTypes.STRING,
      specialhand: DataTypes.STRING,
      points: DataTypes.INTEGER,
      game: DataTypes.INTEGER,
      user: DataTypes.INTEGER,
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['user', 'game'],
        },
      ],
    },
    {
      sequelize,
      modelName: 'UserCard',
    },
  );
  return UserCard;
};
