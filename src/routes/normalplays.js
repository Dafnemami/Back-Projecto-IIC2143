require('dotenv').config();
const Router = require('koa-router');
const jwt = require('koa-jwt');
const { setCurrentUser } = require('../middleware/auth');

const router = new Router();

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(setCurrentUser);

router.post('/', async (ctx) => {
  try {
    // console.log(ctx.request)
    ctx.request.body.round = await ctx.orm.Game.findByPk(ctx.request.body.game);
    ctx.request.body.round = ctx.request.body.round.round;
    ctx.request.body.user = ctx.state.authData.id;
    if (ctx.request.body.card === 0 || ctx.request.body.card > 104) {
      const error = Error('Card not found');
      error.code = 404;
      throw error;
    }
    const hand = await ctx.orm.UserCard.findOne({
      where: {
        game: ctx.request.body.game,
        user: ctx.state.authData.id,
      },
    });
    if (hand == null) {
      const error = Error("You aren't playing this game");
      error.code = 400;
      throw error;
    } else if (!hand.hand.includes(String(ctx.request.body.card))) {
      const error = Error("You don't have that card");
      error.code = 400;
      throw error;
    }
    let cards = hand.hand.split(',');
    cards.splice(cards.indexOf(String(ctx.request.body.card)), 1);
    cards = cards.toString();
    hand.update({ hand: cards });
    await hand.save({ field: 'hand' });
    const play = await ctx.orm.NormalPlay.create(ctx.request.body);
    await play.save();
    ctx.body = play;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
}); // crea una jugada -> validar en el modelo y/o migracion

router.get('/game/:id', async (ctx) => {
  try {
    ctx.body = await ctx.orm.NormalPlay.findAll({
      where: {
        game: ctx.request.params.id,
        user: ctx.state.authData.id,
      },
    });
    if (ctx.body === null) {
      const error = Error('Moves not found');
      error.code = 404;
      throw error;
    }
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
}); // obtiene jugadas de la partida

router.get('/round/:id/:num', async (ctx) => {
  try {
    ctx.body = await ctx.orm.NormalPlay.findAll({
      where: {
        game: ctx.request.params.id,
        round: ctx.request.params.num,
        user: ctx.state.authData.id,
      },
    });
    if (ctx.body === null) {
      const error = Error('Moves not found');
      error.code = 404;
      throw error;
    }
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
}); // obtiene jugadas de la ronda de la partida

module.exports = router;
