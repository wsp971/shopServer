const adminUserDao  = require('../dao/adminUserDao');
const koaRouter = require('koa-router');
let router = new koaRouter();

router.get('/login',async (ctx)=>{
	try{
		console.log('login param',ctx);
		let result =  await adminUserDao.login(ctx.query);
		if(result && result[0]){
			console.log('login info:',result[0].username,result[0].name,result[0]);
			ctx.cookies
			.set('username',result[0].username,{
				httpOnly:true,
				domain: 'aoshiman.com.cn',
				path:'/',
				secure:false,
				expires: new Date(Date.now() + 30* 60* 1000)
			})
			.set('loginname',encodeURIComponent(result[0].name),{
				httpOnly:false,
				domain:'aoshiman.com.cn',
				path:'/',
				secure:false,
				expires: new Date(Date.now() + 30* 60* 1000)
			});
			ctx.body = {code:0,msg:'success'};
		}else{
			ctx.body = {code:-1,msg:'login fail'};
		}
	}catch(e){
		ctx.body = {code:-1,msg:'用户名或密码错误！'};
	}
});

router.get('/register',async ctx =>{
	console.log('register param:', ctx.query);
	try{
		let result = await adminUserDao.insertAdminUser(ctx.query);
		ctx.body = {code:0,msg:'success',data:result};
	}catch(e){
		ctx.body = {code:-1,msg:'注册失败'}
	}
});

module.exports = router;