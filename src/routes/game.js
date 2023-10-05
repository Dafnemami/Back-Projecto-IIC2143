require('dotenv').config();
const Router = require('koa-router');
const { Op } = require('sequelize');
const _ = require('underscore');
const jwt = require('koa-jwt');
const { setCurrentUser } = require('../middleware/auth');

const router = new Router();

router.get('/', async (ctx) => {
  try {
    ctx.body = await ctx.orm.Game.findAll();
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.get('/:id', async (ctx) => {
  try {
    console.log('7');
    ctx.body = await ctx.orm.Game.findByPk(ctx.request.params.id);
    if (ctx.body === null) {
      const error = Error('Game not found');
      error.code = 404;
      throw error;
    }
    console.log('8');
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(setCurrentUser);

router.post('/', async (ctx) => {
  try {
    const game = await ctx.orm.Game.create({ player1: ctx.state.authData.id });
    await game.save({
      field: ['player1'],
    });
    const board = await ctx.orm.Board.create({
      game: game.id,
    });
    await board.save({
      field: ['game'],
    });
    ctx.body = game;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.put('/join/:id', async (ctx) => {
  try {
    const game = await ctx.orm.Game.findByPk(ctx.request.params.id);
    if (game === null) {
      const error = Error('Game not found');
      error.code = 404;
      throw error;
    } else if (game.active) {
      const error = Error('The match has already started, but you can be a spec');
      error.code = 403;
      throw error;
    } else if ([game.player1, game.player2, game.player3, game.player4, game.player5, game.player6]
      .includes(ctx.state.authData.id)) {
      const error = Error('You are already in that game');
      error.code = 403;
      throw error;
    }
    if (game.player2 === null) {
      game.update({ player2: ctx.state.authData.id });
    } else if (game.player3 === null) {
      game.update({ player3: ctx.state.authData.id });
    } else if (game.player4 === null) {
      game.update({ player4: ctx.state.authData.id });
    } else if (game.player5 === null) {
      game.update({ player5: ctx.state.authData.id });
    } else if (game.player6 === null) {
      game.update({ player6: ctx.state.authData.id });
    } else if (game.player1 === null) {
      game.update({ player1: ctx.state.authData.id });
    } else {
      const error = Error('Game is full');
      error.code = 403;
      throw error;
    }
    game.update(ctx.request.body);
    await game.save({ field: ['player2', 'player3', 'player4', 'player5', 'player6'] });
    ctx.status = 200; // Si no pones esto, no sabrás que funcionó y te tirará Authentication error
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.put('/join', async (ctx) => {
  try {
    const game = await ctx.orm.Game.findOne({
      where: {
        active: false,
        done: false,
        [Op.or]: [
          { player2: null },
          { player3: null },
          { player4: null },
          { player5: null },
          { player6: null },
          { player1: null },
        ],
      },
    });
    if (game === null) {
      const error = Error('We are sorry, there are no games on going that you can join now');
      error.code = 403;
      throw error;
    } else if (game.player2 === null) {
      game.update({ player2: ctx.state.authData.id });
    } else if (game.player3 === null) {
      game.update({ player3: ctx.state.authData.id });
    } else if (game.player4 === null) {
      game.update({ player4: ctx.state.authData.id });
    } else if (game.player5 === null) {
      game.update({ player5: ctx.state.authData.id });
    } else if (game.player6 === null) {
      game.update({ player6: ctx.state.authData.id });
    } else if (game.player1 === null) {
      game.update({ player1: ctx.state.authData.id });
    }
    await game.save({ field: ['player2', 'player3', 'player4', 'player5', 'player6'] });
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.put('/start/:id', async (ctx) => {
  try {
    const game = await ctx.orm.Game.findByPk(ctx.request.params.id);
    let playercount = 0;
    [game.player1, game.player2, game.player3, game.player4, game.player5, game.player6]
      .forEach((player) => {
        if (player !== null) { playercount += 1; }
      });
    if (playercount < 2) {
      const error = Error('Not enough players to begin');
      error.code = 403; // no se si es el correcto
      throw error;
    }
    if (game === null) {
      const error = Error('Game not found');
      error.code = 404;
      throw error;
    }
    game.update({ active: true });
    await game.save({ field: ['active'] });
    const board = await ctx.orm.Board.findByPk(ctx.request.params.id);
    const cards = _.shuffle(await ctx.orm.NormalCard.findAll());
    const scards = _.shuffle(await ctx.orm.SpecialCard.findAll());
    board.update({
      row1: String(cards.shift().id),
      row2: String(cards.shift().id),
      row3: String(cards.shift().id),
      row4: String(cards.shift().id),
    });
    await board.save({ field: ['row1', 'row2', 'row3', 'row4'] });
    [game.player1, game.player2, game.player3, game.player4, game.player5, game.player6]
      .forEach(async (player) => {
        if (player !== null) {
          let hand = [];
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(() => {
            hand.push(cards.pop().id);
          });
          hand = hand.join();
          const shand = _.sample(scards, 3); // creo que este no repite
          const specialhand2 = [];
          shand.forEach((scard) => {
            specialhand2.push(scard.id);
          });
          const specialhand = specialhand2.join();
          const usercard = await ctx.orm.UserCard.create({
            hand,
            specialhand,
            points: 0,
            game: game.id,
            user: player,
          });
          await usercard.save();
        }
      });
    ctx.body = { game, board };
    ctx.status = 200; // Si no pones esto, no sabrás que funcionó y te tirará Not Found
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.put('/end/:id', async (ctx) => {
  try {
    const game = await ctx.orm.Game.findByPk(ctx.request.params.id);
    if (game === null) {
      const error = Error('Game not found');
      error.code = 404;
      throw error;
    }
    game.update({ active: false, done: true });
    await game.save({ field: ['active', 'done'] });
    ctx.status = 200; // Si no pones esto, no sabrás que funcionó y te tirará  Not Found
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.delete('/:id', async (ctx) => {
  try {
    const game = await ctx.orm.Game.findByPk(ctx.request.params.id);
    if (game === null) {
      const error = Error('Game not found');
      error.code = 404;
      throw error;
    }
    await game.destroy();
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

module.exports = router;
