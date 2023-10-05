const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Game, {
        foreignKey: 'id',
      });
      this.hasMany(models.NormalPlay, {
        foreignKey: 'id',
      });
      this.hasMany(models.SpecialPlay, {
        foreignKey: 'id',
      });
    }

    generateToken() {
      const user = this;
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7 days' },
      );
      return token;
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
