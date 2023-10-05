const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'player1',
      });
      this.belongsTo(models.User, {
        foreignKey: 'player2',
      });
      this.belongsTo(models.User, {
        foreignKey: 'player3',
      });
      this.belongsTo(models.User, {
        foreignKey: 'player4',
      });
      this.belongsTo(models.User, {
        foreignKey: 'player5',
      });
      this.belongsTo(models.User, {
        foreignKey: 'player6',
      });
      this.hasOne(models.Board, {
        foreignKey: 'id',
        onDelete: 'cascade',
        hooks: true,
      });
      this.hasMany(models.NormalPlay, {
        foreignKey: 'game',
        onDelete: 'cascade',
        hooks: true,
      });
    }

    async end(ctx) {
      this.update({ active: false, done: true });
      await this.save({ field: ['active', 'done'] });
      const results = [];
      [this.player1, this.player2, this.player3, this.player4, this.player5, this.player6]
        .forEach(async (player) => {
          if (player !== null) {
            const play = await ctx.orm.User.findByPk(ctx.request.params.id);
            const points = await ctx.orm.UserCard.findOne({
              where: {
                game: this.id,
                user: player, // esto despues se obtendra usando el token
              },
            });
            results.push([play.username, points.points]);
          }
        });
      ctx.body = results;
    }
  }
  Game.init({
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    round: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    player1: DataTypes.STRING,
    player2: DataTypes.STRING,
    player3: DataTypes.STRING,
    player4: DataTypes.STRING,
    player5: DataTypes.STRING,
    player6: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};
