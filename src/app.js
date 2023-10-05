const Koa = require('koa');
const koaBody = require('koa-body');
const KoaLogger = require('koa-logger');
const cors = require('@koa/cors');
const koaJWT = require('koa-jwt');
const session = require('koa-session');
const swagger = require('swagger2');
const { koaSwagger } = require('koa2-swagger-ui');
const router = require('./routes');
const orm = require('./models');

// Iniciar app
const app = new Koa();

// Atach Sequelize ORM to the context of the App
app.context.orm = orm;

app.use(cors());

// Logs requests from the server
app.use(KoaLogger());

// Parse Request Body
app.use(koaBody());

// Session
app.keys = [`${process.env.APP_KEYS}`];
const CONFIG = {
  htppOnly: false,
};

app.use(session(CONFIG, app));

// Swagger middleware
const swaggerDocument = swagger.loadDocumentSync('api.yaml');
app.use(koaSwagger({
  routePrefix: '/docs',
  swaggerOptions: {
    spec: swaggerDocument,
  },
}));

app.use(router.routes());
app.use(router.allowedMethods()); // Allow HTTP Methods

app.use(koaJWT({ secret: `${process.env.JWT_SECRET}`, key: 'tokendata' }));

module.exports = app;
