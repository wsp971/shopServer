const koaRouter = require('koa-router');
const router = new koaRouter();
const userDao = require('../dao/userDao');

router.get('/insert',async (ctx)=>{
	let testUser = {
		name:'wangshiping1',
		
	};
	
	try{
		let result = await userDao.insertUser(testUser);
		ctx.body = {
			code:0,
			data: result,
			msg:'success'
		};
	}catch(e){
		ctx.body = e;
	}
});


router.get('/query', async ctx=>{
	console.log(ctx.query);
	try{
		let result = await userDao.queryUser(ctx.query);
		ctx.body = result;
	}catch (e){
		ctx.body = e;
	}
});

router.get('/update', async ctx =>{
	let modifiedUser = {
		name:'wangshiping5',
		age:27
	};
	try{
		let result = await userDao.updateUser(ctx.query,modifiedUser)
		ctx.body = result;
	}catch(e){
		ctx.body = e;
	}
});



module.exports = router;


