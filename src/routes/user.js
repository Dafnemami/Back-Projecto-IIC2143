require('dotenv').config();
const jwt = require('koa-jwt');
const Router = require('koa-router');
const bcrypt = require('bcrypt');

const router = new Router();

router.post('/login', async (ctx) => {
  try {
    const user = await ctx.orm.User.findOne({
      where: {
        username: ctx.request.body.username,
      },
    });

    if (user === null) {
      ctx.body = 'User does not exist.';
      ctx.response.status = 404;
    } else {
      const compare = await bcrypt.compare(ctx.request.body.password, user.password);
      if (compare) {
        ctx.body = {
          token: user.generateToken(),
          token_type: 'Bearer',
          // tipo_usuario: user.tipo_usuario,
          username: user.username,
          id: user.id,
        };
        ctx.session.userId = user.id;
        ctx.response.status = 200;
      } else {
        ctx.body = 'Incorrent credencials.';
        ctx.response.status = 401;
      }
    }
  } catch (error) {
    ctx.body = error.message;
    ctx.response.status = error.code || 400;
  }
});

router.post('/', async (ctx) => {
  try {
    const checkBD = await ctx.orm.User.findOne({
      where: {
        username: ctx.request.body.username,
      },
    });
    if (checkBD !== null) {
      const error = Error('User already exists.');
      error.code = 403;
      throw error;
    }

    const passwordHash = await bcrypt.hash(ctx.request.body.password, 5);

    const user = await ctx.orm.User.create(ctx.request.body);
    user.password = passwordHash;

    user.save({
      password: passwordHash,
      field: [
        'username',
        'password',
        'email',
      ],
    });

    ctx.body = {
      token: user.generateToken(),
      token_type: 'Bearer',
      username: user.username,
      id: user.id,
    };
    ctx.response.status = 201;
  } catch (error) {
    console.log(error);
    ctx.body = error.message;
    ctx.response.status = 400;
  }
});

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));

module.exports = router;
