const koaRouter = require('koa-router');
const router = new koaRouter();
const miniProgramSao = require('../dao/miniProgramSao');
const miniProgramDao = require('../dao/miniProgramDao');
const dishDao = require('../dao/dishesDao');
const shopDao = require('../dao/shopDao');
const WXBizDataCrypt = require('../common/wxBizDataCrypt');

function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
}



// 获取微信session key
router.get('/getsessionkey', async ctx => {
  let { code } = ctx.query;
  try {
    let result = await miniProgramSao.getSessionFromWeixin(code);
    if (result.data.openid && result.data.session_key) {
      let findUser = await miniProgramSao.findClientUser({ openid: result.data.openid });

      if (findUser && findUser[0]) {
        const user = findUser[0];
        console.log('xxxx', user, result.data.session_key);
        user.sessionKey = result.data.session_key;
        // 同步sessionkey 到数据库
        console.log('sync', user);
        await miniProgramSao.syncClientUser(user);
        ctx.body = {
          code: 0,
          data: {
            openid: result.data.openid
          },
          message: 'success'
        };
      } else {
        let addNewUser = await miniProgramSao.addNewClientUser(
          { openid: result.data.openid, sessionKey: result.data.session_key });
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
    console.log('getSessionkeyError', e);
    ctx.body = {
      code: -2,
      message: 'error'
    }
  }
});


// 同步客户端用户信息
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


// 获取存储得客户端用户信息
router.get('/getUserInfo', async ctx => {
  try {
    let result = await miniProgramSao.findClientUser(ctx.query);
    console.log('userinfo', result);
    if (result) {
      if (!result[0]) {
        await miniProgramSao.addNewClientUser(ctx.query)
        ctx.body = {
          code: 0,
          message: 'success',
          data: {
            ...result,
            ...ctx.query
          }
        }
      } else {
        ctx.body = {
          code: 0,
          message: 'success',
          data: result
        }
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

// 随机推荐菜品
router.get('/suggestFood', async ctx => {
  try {
    const { openid, needFilter } = ctx.query;
    console.log('openid', openid);
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
    // 随机打乱
    result = shuffle(result);
    // console.log('result', result);
    const queryUserResult = await miniProgramSao.findClientUser({ openid });
    const userinfo = queryUserResult[0];
    result = result.map(dish => {
      // 为啥这么写呢？ dish 对象被mongosse设置成不可扩展。。。
      const {
        _id,
        name,
        type,
        description,
        price,
        shopid,
        favourites,
        tags,
        pics,
        comments,
        prePrice,
        heatQuatity
      } = dish;
      return {
        _id,
        name,
        type,
        description,
        price,
        shopid,
        favourites,
        tags,
        pics,
        comments,
        prePrice,
        heatQuatity,
        isFav: userinfo.favDishes[0] && userinfo.favDishes.indexOf(dish._id) > -1
      }
    })

    //需要过滤自己已经喜欢的
    if (needFilter == 1) {
      result = result.filter(item => !item.isFav);
    }
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
    console.log(e);
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
});



router.get('/suggestShop', async ctx => {
  try {
    const { openid } = ctx.query;
    console.log('openid', openid);
    let result = await shopDao.queryShop(0, 5);
    // 随机打乱数组
    function shuffle(arr) {
      let i = arr.length;
      while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
      return arr;
    }
    // 随机打乱
    result = shuffle(result);
    // console.log('result', result);
    const queryUserResult = await miniProgramSao.findClientUser({ openid });
    const userinfo = queryUserResult[0];
    result = result.map(shop => {
      // 为啥这么写呢？ shop 对象被mongosse设置成不可扩展。。。
      const {
        id, latLng, name, phone, address, favourite, logo, contacts
      } = shop;
      return {
        id, latLng, name, phone, address, favourite, logo, contacts,
        isFav: userinfo.favShops[0] && userinfo.favShops.indexOf(shop.id) > -1
      }
    })
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
    console.log(e);
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
})


router.get('/favFood', async ctx => {
  try {
    console.log(ctx.headers.openid, 'header');
    console.log(ctx.query.openid, 'ctx.query');
    const { openid, id, type } = ctx.query;
    const theDish = await dishDao.queryDishById(id);
    if (!theDish) {
      ctx.body = {
        code: -1,
        message: '该菜品不存在！'
      }
      return;
    }
    // type:1,喜欢，2 取消喜欢
    if (type == 1) {
      theDish.favourites += 1;
    } else {
      theDish.favourites -= 1;
    }
    await miniProgramDao.addMyFavFood(openid, id, type);
    await dishDao.updateDish(id, theDish);
    ctx.body = {
      code: 0,
      message: 'success',
    }
  } catch (e) {
    console.log('favfooderr', e);
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
})


router.get('/addDisLikeFood', async ctx => {
  try {
    console.log(ctx.query.openid, 'ctx.query');
    const { openid, id } = ctx.query;
    const theDish = await dishDao.queryDishById(id);
    if (!theDish) {
      ctx.body = {
        code: -1,
        message: '该菜品不存在！'
      }
      return;
    }
    await miniProgramDao.addMyDisLikeFood(openid, id);
    ctx.body = {
      code: 0,
      message: 'success',
    }
  } catch (e) {
    console.log('dislikefooderr', e);
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
})

router.get('/favShop', async ctx => {
  try {
    console.log(ctx.headers.openid, 'header');
    console.log(ctx.query.openid, 'ctx.query');
    const { openid, id, type } = ctx.query;
    console.log('query', openid, id, type);
    const result = await shopDao.queryShopByCondition({ id: id })
    const theShop = result[0];
    console.log('theshop', theShop);
    if (!theShop) {
      ctx.body = {
        code: -1,
        message: '该店铺不存在！'
      }
      return;
    }
    // type:1,收藏； 2 取消收藏
    if (type == 1) {
      theShop.favourite += 1;
    } else {
      theShop.favourite -= 1;
    }
    await miniProgramDao.addMyFavShop(openid, id, type);
    await shopDao.updateShop({ id: id }, theShop);
    ctx.body = {
      code: 0,
      message: 'success',
    }
  } catch (e) {
    console.log('favShop Err', e);
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
})


router.get('/myFavShop', async ctx => {
  try {
    const { openid } = ctx.query;
    console.log('openid', openid);
    const queryUserResult = await miniProgramSao.findClientUser({ openid });
    const userInfo = queryUserResult[0];
    const { favShops } = userInfo;
    console.log('favShops', favShops);
    const result = await shopDao.queryShopByIds(favShops);
    if (result) {
      ctx.body = {
        code: 0,
        message: 'success',
        data: result
      }
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
})


router.get('/myFavDish', async ctx => {
  try {
    const { openid } = ctx.query;
    console.log('openid', openid);
    const queryUserResult = await miniProgramSao.findClientUser({ openid });
    const userInfo = queryUserResult[0];
    const { favDishes } = userInfo;
    console.log('favDishes', favDishes);
    const result = await dishDao.batchQueryByIds(favDishes);
    if (result) {
      ctx.body = {
        code: 0,
        message: 'success',
        data: result
      }
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
})

router.get('/getWeixinRun', async ctx => {
  const { openid, encryptedData, iv } = ctx.query;
  console.log('getweixinrun', openid, encryptedData, iv);
  const WXBizDataCryptObj = new WXBizDataCrypt(openid);
  const weixinRunData = await WXBizDataCryptObj.decryptData(
    encryptedData, iv
  );
  ctx.body = {
    code: 0,
    message: 'success',
    data: weixinRunData
  }
})


router.get('/getRecommendByRun', async ctx => {
  try {
    const { openid, type } = ctx.query;
    console.log('openid', openid);
    let result = await dishDao.queryDishByHeat(type);

    result = shuffle(result);

    ctx.body = {
      code: 0,
      message: 'success',
      data: result,
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: -2,
      message: e.message
    }
  }
})




module.exports = router;