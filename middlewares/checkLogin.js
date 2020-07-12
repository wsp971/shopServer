module.exports = function (whiteList) {
  return async (ctx, next) => {
    const { path } = ctx;
    console.log('writelist', whiteList, path);
    if (!path.startsWith('/miniProgram') || whiteList.includes(path)) {
      await next();
      return;
    }
    const { openid } = ctx.query;
    if (!openid) {
      ctx.body = {
        code: -1000,
        message: 'noLogin'
      }
      return;
    }
    await next();
  }
}



