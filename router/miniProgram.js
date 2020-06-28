const koaRouter = require('koa-router');
const router = new koaRouter();
const miniProgramSao = require('../dao/miniProgramSao');
const dishDao = require('../dao/dishesDao');


router.get('/getsessionkey', async ctx => {
  let { code } = ctx.query;
  try {
    let result = await miniProgramSao.getSessionFromWeixin(code);
    if (result.data.openid && result.data.session_key) {
      let user = await miniProgramSao.findClientUser({ openid: result.data.openid });
      if (user) {
        ctx.body = {
          code: 0,
          data: {
            openid: result.data.openid
          },
          message: 'success'
        };
      } else {
        let addNewUser = await miniProgramSao.addNewClientUser({ openid: result.data.openid });
        if (addNewUser) {
          ctx.body = {
            code: 0,
            data: {
              openid: result.data.openid
            },
            message: 'success'
          };
        } else {
          ctx.body = {
            code: -1,
            data: result.data,
            message: 'fail'
          }
        }
      }

    } else {
      ctx.body = {
        code: -1,
        data: result.data,
        message: 'fail'
      }
    }

  } catch (e) {
    ctx.body = {
      code: -2,
      message: 'error'
    }
  }
});


router.get('/syncUserInfo', async ctx => {
  try {
    let result = miniProgramSao.syncClientUser(ctx.query);
    if (result) {
      ctx.body = {
        code: 0,
        message: 'success',
        data: result
      }
    } else {
      ctx.body = {
        code: -1,
        message: 'fail'
      }
    }

  } catch (e) {
    ctx.body = {
      code: -2,
      message: 'error'
    }
  }
});



router.get('/suggestFood', async ctx => {
  try {
    let result = await dishDao.queryDish(0, 100);
    // 随机打乱数组
    function shuffle(arr) {
      let i = arr.length;
      while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
      return arr;
    }
    result = shuffle(result);
    if (result) {
      ctx.body = {
        code: 0,
        message: 'success',
        data: result
      }
    } else {
      ctx.body = {
        code: -1,
        message: 'fail'
      }
    }
  } catch (e) {
    ctx.body = {
      code: -2,
      message: 'error'
    }
  }
});

module.exports = router;