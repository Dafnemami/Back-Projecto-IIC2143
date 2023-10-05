const Router = require('koa-router');

const router = new Router();

router.get('health', '/', async (ctx) => {
  try {
    ctx.body = { status: 'UP' }; // Devuelve un JSON
    ctx.status = 200;
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

module.exports = router;
