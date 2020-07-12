
const koaRouter = require('koa-router');
const router = new koaRouter();
const dishDao = require('../dao/dishesDao');

router.post('/insert', async (ctx) => {

  // let newDish = Object.assign(ctx.query,{id: + new Date()});
  // console.log(ctx.query);
  let postData = ctx.request.body;
  try {
    let result = await dishDao.insertDish(postData);
    ctx.body = {
      code: 0,
      data: result,
      msg: 'success'
    };
  } catch (e) {
    ctx.body = e;
  }
});


router.post('/update', async ctx => {
  let postData = ctx.request.body;
  console.log('postData', postData);
  try {
    let result = await dishDao.updateDish(postData.dishId, postData);
    ctx.body = {
      code: 0,
      data: result,
      msg: 'success'
    };
  } catch (e) {
    ctx.body = e;
  }
})


router.get('/dishList', async ctx => {
  console.log(ctx.query);
  let { pageIndex, pageSize, shopid } = ctx.query;
  let queryObj = {};
  if (shopid) {
    queryObj.shopid = shopid;
  }
  try {
    let result = await Promise.all([dishDao.queryDish(pageIndex, pageSize, queryObj), dishDao.dishCount(queryObj)]);
    ctx.body = { code: 0, msg: 'success', data: result[0], totalCount: result[1] };
  } catch (e) {
    ctx.body = e;
  }
});

router.get('/getDishById', async ctx => {

  const { id } = ctx.query;

  const result = await dishDao.queryDishById(id);

  ctx.body = {
    code: 0,
    message: 'success',
    data: result
  }

})


router.get('/delete', async ctx => {
  try {
    let deleteDish = { _id: ctx.query.id };
    let result = await dishDao.deleteDish(deleteDish);
    if (result) {
      ctx.body = { code: 0, msg: 'success' }
    } else {
      ctx.body = { code: -1, msg: 'delete fail' };
    }
  } catch (e) {
    ctx.body = { code: -1, msg: 'delete fail' };
  }
});


module.exports = router;