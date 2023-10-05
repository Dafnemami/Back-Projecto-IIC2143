async function setCurrentUser(ctx, next) {
  const { authData } = ctx.state;
  if (!authData) {
    ctx.throw('Not logged in', 401);
  }
  ctx.state.currentUser = await ctx.orm.User.findByPk(authData.sub);
  await next();
}

module.exports = {
  setCurrentUser,
};
