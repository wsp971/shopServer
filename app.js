const koa = require('koa');
const koaParser = require('koa-bodyparser');
const koaRouter = require('koa-router');
const koaCompose = require('koa-compose');
const koaCompress = require('koa-compress');
const path = require('path');
const cors = require('koa2-cors');

const app = new koa();
const router = new koaRouter();
const userRouter  = require('./router/user');
const shopRouter  = require('./router/shop');
const adminUserRouter  = require('./router/adminUser');
const dishRouter  = require('./router/dishes');
const miniProgram = require('./router/miniProgram');

//允许跨域访问 详细配置：https://www.npmjs.com/package/koa2-cors
app.use(cors({
	credentials: true
}));

app.use(koaParser());

const options = { threshold: 2048 };

app.use(koaCompress(options));//koa开启gzip压缩

router.use('/user',userRouter.routes());
router.use('/shop',shopRouter.routes());
router.use('/adminuser',adminUserRouter.routes());
router.use('/dish',dishRouter.routes());
router.use('/miniProgram',miniProgram.routes());




app
.use(router.routes())
.use(router.allowedMethods());


router.get('/lala',async (ctx,next)=>{
	ctx.body = {name:'llaalal'};
	await next();
});

module.exports= app;




