const koaRouter = require('koa-router');
const router = new koaRouter();
const shopDao = require('../dao/shopDao');

const multer = require('koa-multer');
// cb(null, '../config/');

const publicPath = 'http://aoshiman.com.cn/uploads/';


let storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, '/data/www/uploads')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});


var upload = multer({ storage: storage });

router.post('/upload', upload.single('fileInput'), async (ctx, next) => {
  ctx.body = {
    filename: publicPath + ctx.req.file.filename           //返回文件名
  }
});


router.post('/insert', async (ctx) => {
  let newShop = Object.assign(ctx.request.body, { id: + new Date() });
  try {
    let result = await shopDao.insertShop(newShop);
    ctx.body = {
      code: 0,
      data: result,
      msg: 'success'
    };
  } catch (e) {
    ctx.body = e;
  }
});


router.get('/shopList', async ctx => {
  console.log(ctx.query);
  let { pageIndex, pageSize } = ctx.query;
  try {
    let result = await Promise.all([shopDao.queryShop(pageIndex, pageSize), shopDao.shopCount()]);
    ctx.body = { code: 0, msg: 'success', data: result[0], totalCount: result[1] };
  } catch (e) {
    ctx.body = e;
  }
});

router.get('/queryByid', async ctx => {
  console.log(ctx.query);
  let queryObj = { id: ctx.query.shopid };
  try {
    let result = await shopDao.queryShopByCondition(queryObj);
    if (result) {
      ctx.body = { code: 0, msg: 'success', data: result };
    } else {
      ctx.body = { code: -1, msg: 'fail' };
    }
  } catch (e) {
    ctx.body = { code: -2, msg: 'error' };
  }
});

router.post('/update', async ctx => {
  let oldShop = {
    id: ctx.request.body.id
  };
  try {
    let result = await shopDao.updateShop(oldShop, ctx.request.body);
    if (result) {
      ctx.body = { code: 0, msg: 'success' }
    } else {
      ctx.body = { code: -1, msg: 'update fail' };
    }
  } catch (e) {
    console.log(e);
    ctx.body = { code: -1, msg: 'update fail' };

  }
});

router.get('/delete', async ctx => {
  try {
    let deleteShop = { id: ctx.query.id };
    let result = await shopDao.deleteShop(deleteShop);
    if (result) {
      ctx.body = { code: 0, msg: 'success' }
    } else {
      ctx.body = { code: -1, msg: 'delete fail' };
    }
  } catch (e) {
    ctx.body = { code: -1, msg: 'delete fail' };
  }

});



router.get("/getClientIp", async ctx => {
  ctx.body = {
    code: 0,
    ip: getClientIp(ctx.req),
    msg: "success"
  }
});


function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

module.exports = router;


