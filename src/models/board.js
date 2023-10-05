const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
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
    }

    execute_plays(plays, ctx, splays) {
      splays.forEach(async (play) => {
        if (play.card === 1) { // Inicio
          let row = [];
          if (play.row === 1) {
            row = this.row1;
          } else if (play.row === 2) {
            row = this.row2;
          } else if (play.row === 3) {
            row = this.row3;
          } else if (play.row === 4) {
            row = this.row4;
          } else {
            const error = Error('Invalid row');
            error.code = 400;
            throw error;
          }
          let card = 0; // find associated from plays, extract card, delete
          let del = 0;
          plays.forEach(async (nplay) => {
            if (nplay.user === play.user) {
              card = nplay.card;
              del = nplay;
              await nplay.destroy();
            }
          });
          if (card === 0) {
            const error = Error("That player somehow didn't play any card");
            error.code = 400;
            throw error;
          }
          // console.log(del)
          // console.log(plays)
          plays.splice(plays.indexOf(del), 1);
          if (row === this.row1) {
            this.update({ row1: `${String(card)},${this.row1}` });
            await this.save({ field: ['row1'] });
          } else if (row === this.row2) {
            this.update({ row2: `${String(card)},${this.row2}` });
            await this.save({ field: ['row2'] });
          } else if (row === this.row3) {
            this.update({ row3: `${String(card)},${this.row3}` });
            await this.save({ field: ['row3'] });
          } else if (row === this.row4) {
            this.update({ row4: `${String(card)},${this.row4}` });
            await this.save({ field: ['row4'] });
          }
        } else if (play.card === 2) { // Ascendente aka al final de cualquiera legal
          let row = [];
          if (play.row === 1) {
            row = this.row1;
          } else if (play.row === 2) {
            row = this.row2;
          } else if (play.row === 3) {
            row = this.row3;
          } else if (play.row === 4) {
            row = this.row4;
          } else {
            const error = Error('Invalid row');
            error.code = 400;
            throw error;
          }
          let card = 0; // find associated from plays, extract card, delete
          let del = 0;
          plays.forEach(async (nplay) => {
            if (nplay.user === play.user) {
              card = nplay.card;
              del = nplay;
              await nplay.destroy();
            }
          });
          // console.log(card)
          if (card === 0) {
            const error = Error("That player somehow didn't play any card");
            error.code = 400;
            throw error;
          }
          plays.splice(plays.indexOf(del), 1);
          if (row.length === 5) {
            // const user = await ctx.orm.User.findByPk(play.user)
            const hand = await ctx.orm.UserCard.findOne({
              where: {
                user: play.user,
                game: play.game,
              },
            });
            const cards = row.split(',');
            cards.forEach(async (ncard) => {
              const carta = await ctx.orm.NormalCard.findByPk(ncard);
              hand.update({ points: hand.points + carta.points });
            });
            await hand.save({ field: ['points'] });
            if (row === this.row1) {
              this.update({ row1: String(play.card) });
              await this.save({ field: ['row1'] });
            } else if (row === this.row2) {
              this.update({ row2: String(play.card) });
              await this.save({ field: ['row2'] });
            } else if (row === this.row3) {
              this.update({ row3: String(play.card) });
              await this.save({ field: ['row3'] });
            } else if (row === this.row4) {
              this.update({ row4: String(play.card) });
              await this.save({ field: ['row4'] });
            }
          } else if (row === this.row1) {
            this.update({ row1: `${this.row1},${String(card)}` });
            await this.save({ field: ['row1'] });
          } else if (row === this.row2) {
            this.update({ row2: `${this.row2},${String(card)}` });
            await this.save({ field: ['row2'] });
          } else if (row === this.row3) {
            this.update({ row3: `${this.row3},${String(card)}` });
            await this.save({ field: ['row3'] });
          } else if (row === this.row4) {
            this.update({ row4: `${this.row4},${String(card)}` });
            await this.save({ field: ['row4'] });
          }
        } else if (play.card === 3) { // Omitir aka bloquear proximo espacio
          let row = [];
          if (play.row === 1) {
            row = this.row1;
          } else if (play.row === 2) {
            row = this.row2;
          } else if (play.row === 3) {
            row = this.row3;
          } else if (play.row === 4) {
            row = this.row4;
          } else {
            const error = Error('Invalid row');
            error.code = 400;
            throw error;
          }
          if (row === this.row1) {
            this.update({ row1: `${this.row1},O` });
            await this.save({ field: ['row1'] });
          } else if (row === this.row2) {
            this.update({ row2: `${this.row2},O` });
            await this.save({ field: ['row2'] });
          } else if (row === this.row3) {
            this.update({ row3: `${this.row3},O` });
            await this.save({ field: ['row3'] });
          } else if (row === this.row4) {
            this.update({ row4: `${this.row4},O` });
            await this.save({ field: ['row4'] });
          }
        } else if (play.card === 4) { // Menos es mas -> una carta te resta puntos (la con mas)
          const a = 5; // decide if keep
        }
      });
      plays.forEach(async (play) => {
        // let start = '0';
        let rowplay = '';
        let take = false;
        let max = 0;
        [this.row1, this.row2, this.row3, this.row4].forEach(async (row) => {
          // console.log(row); // es un numero
          const cards = row.split(',');
          // console.log(cards);
          let check = cards.length - 1;
          if (cards[check] === 'O') {
            check -= 1;
          }
          if (parseInt(cards[check], 10) < parseInt(play.card, 10)
          && parseInt(max, 10) < parseInt(cards[check], 10)) {
            // start = cards[cards.length - 1];
            rowplay = row;
            max = cards[check];
            if (cards.length === 5) {
              take = true;
            } else {
              take = false;
            }
          }
        });
        if (rowplay === '') {
          // elige una fila
          const rows = [this.row1, this.row2, this.row3, this.row4];
          rowplay = Math.floor(Math.random() * rows.length);
        }
        // console.log('row_play');
        // console.log(rowplay);
        if (take) {
          // const user = await ctx.orm.User.findByPk(play.user)
          const hand = await ctx.orm.UserCard.findOne({
            where: {
              user: play.user,
              game: play.game,
            },
          });
          const cards = rowplay.split(',');
          let maxi = 0;
          cards.forEach(async (card) => {
            if (card !== 'O') {
              const carta = await ctx.orm.NormalCard.findByPk(card);
              hand.update({ points: hand.points + carta.points });
              if (maxi < carta.points) { maxi = carta.points; }
            }
          });
          splays.forEach((splay) => {
            if (splay.user === play.user && splay.card === 4) {
              hand.update({ points: hand.points - 2 * maxi });
            } // decidir si mejor que afecte al jugador siempre durante esa ronda
            // o si mejor que afecte a cualquier jugador que se lleve esa fila esa ronda
          });
          await hand.save({ field: ['points'] });
          if (rowplay === this.row1) {
            this.update({ row1: String(play.card) });
            await this.save({ field: ['row1'] });
          } else if (rowplay === this.row2) {
            this.update({ row2: String(play.card) });
            await this.save({ field: ['row2'] });
          } else if (rowplay === this.row3) {
            this.update({ row3: String(play.card) });
            await this.save({ field: ['row3'] });
          } else if (rowplay === this.row4) {
            this.update({ row4: String(play.card) });
            await this.save({ field: ['row4'] });
          }
        } else {
          console.log('placing cards');
          if (rowplay === this.row1) {
            this.update({ row1: `${this.row1},${String(play.card)}` });
            await this.save({ field: ['row1'] });
          } else if (rowplay === this.row2) {
            this.update({ row2: `${this.row2},${String(play.card)}` });
            await this.save({ field: ['row2'] });
          } else if (rowplay === this.row3) {
            this.update({ row3: `${this.row3},${String(play.card)}` });
            await this.save({ field: ['row3'] });
          } else if (rowplay === this.row4) {
            this.update({ row4: `${this.row4},${String(play.card)}` });
            await this.save({ field: ['row4'] });
          }
        }
      });
    }
  }
  Board.init({
    row1: DataTypes.STRING,
    row2: DataTypes.STRING,
    row3: DataTypes.STRING,
    row4: DataTypes.STRING,
    game: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};
