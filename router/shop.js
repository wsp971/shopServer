const koaRouter = require('koa-router');
const router = new koaRouter();
const shopDao = require('../dao/shopDao');

router.get('/insert',async (ctx)=>{
	let newShop = Object.assign(ctx.query,{id: + new Date()});
	try{
		let result = await shopDao.insertShop(newShop);
		ctx.body = {
			code:0,
			data: result,
			msg:'success'
		};
	}catch(e){
		ctx.body = e;
	}
});


router.get('/shopList', async ctx=>{
	console.log(ctx.query);
	let {pageIndex,pageSize} = ctx.query;
	try{
		let result = await Promise.all([shopDao.queryShop(pageIndex,pageSize),shopDao.shopCount()]);
		ctx.body = {code:0,msg:'success',data:result[0],totalCount:result[1]};
	}catch (e){
		ctx.body = e;
	}
});

router.get('/queryByid', async ctx=>{
	console.log(ctx.query);
	let queryObj = {id: ctx.query.shopid};
	try{
		let result = await shopDao.queryShopByCondition(queryObj);
		if(result){
			ctx.body = {code:0,msg:'success',data: result};
		}else{
			ctx.body = {code: -1,msg:'fail'};
		}
	}catch(e){
		ctx.body = {code: -2,msg:'error'};
	}
});

router.get('/update', async ctx =>{
		let oldShop = {
			id: ctx.query.id
		};
		try{
			let result = await shopDao.updateShop(oldShop,ctx.query);
			if(result){
				ctx.body = {code:0,msg:'success'}
			}else{
				ctx.body={code: -1,msg:'update fail'};
			}
		}catch(e){
			console.log(e);
			ctx.body={code: -1,msg:'update fail'};
			
		}
});

router.get('/delete',async ctx =>{
	try{
		let deleteShop = {id: ctx.query.id};
		let result = await shopDao.deleteShop(deleteShop);
		if(result){
			ctx.body = {code:0,msg:'success'}
		}else{
			ctx.body={code: -1,msg:'delete fail'};
		}
	}catch(e){
		ctx.body={code: -1,msg:'delete fail'};
	}
	
});


module.exports = router;


