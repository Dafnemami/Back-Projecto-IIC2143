const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NormalCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NormalCard.init({
    // description: DataTypes.STRING,
    // value: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'NormalCard',
  });
  return NormalCard;
};
