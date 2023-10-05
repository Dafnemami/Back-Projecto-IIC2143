require('dotenv').config();
const Router = require('koa-router');
const jwt = require('koa-jwt');
const { setCurrentUser } = require('../middleware/auth');

const router = new Router();

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(setCurrentUser);

router.get('/game/:id', async (ctx) => {
  try {
    ctx.body = await ctx.orm.UserCard.findOne({
      where: {
        game: ctx.request.params.id,
        user: ctx.state.authData.id, // esto despues se obtendra usando el token
      },
    });
    if (ctx.body === null) {
      const error = Error('Cards not found');
      error.code = 404;
      throw error;
    }
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

module.exports = router;
