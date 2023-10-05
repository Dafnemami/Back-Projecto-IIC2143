require('dotenv').config();
const Router = require('koa-router');
const jwt = require('koa-jwt');
const { setCurrentUser } = require('../middleware/auth');

const router = new Router();

router.get('/', async (ctx) => {
  try {
    ctx.body = await ctx.orm.Board.findAll();
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.get('/:id', async (ctx) => {
  try {
    ctx.body = await ctx.orm.Board.findByPk(ctx.request.params.id);
    if (ctx.body === null) {
      const error = Error('Board not found');
      error.code = 404;
      throw error;
    }
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(setCurrentUser);

// editar -> modifica los rows dadas las jugadas tal vez
router.put('/:id', async (ctx) => {
  try {
    const game = await ctx.orm.Game.findByPk(ctx.request.params.id);
    if (game === null) {
      const error = Error('Game not found');
      error.code = 404;
      throw error;
    }
    const board = await ctx.orm.Board.findByPk(ctx.request.params.id);
    if (board === null) {
      const error = Error('Board not found');
      error.code = 404;
      throw error;
    }
    const plays = await ctx.orm.NormalPlay.findAll({
      where: {
        round: game.round,
        game: game.id,
      },
    });
    let playercount = 0;
    [game.player1, game.player2, game.player3, game.player4, game.player5, game.player6]
      .forEach((player) => {
        if (player !== null) { playercount += 1; }
      });
    if (plays === null) {
      const error = Error('No one has played any cards this round');
      error.code = 404;
      throw error;
    } else if (plays.length !== playercount) {
      const error = Error('Not everybody has played a card');
      error.code = 403; // no se si es el correcto
      throw error;
    }
    const splays = await ctx.orm.SpecialPlay.findAll({
      where: {
        round: game.round,
        game: game.id,
      },
    });
    // if (splays === null) {
    //   const error = Error('No one has played any cards this round');
    //   error.code = 404;
    //   throw error;
    // }
    // assign cards, give points, advance round
    await plays.sort((a, b) => (a.card - b.card));
    board.execute_plays(plays, ctx, splays);
    game.update({ round: game.round + 1 });
    await game.save({ field: ['round'] });
    ctx.body = board;
    if (game.round > 10) {
      game.end();
    }
    ctx.status = 202;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

module.exports = router;
