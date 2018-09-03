const koaRouter = require('koa-router');
const router = new koaRouter();
const miniProgramSao = require('../dao/miniProgramSao');


router.get('/getsessionkey',async ctx =>{
	let {code} = ctx.query;
	try{
		let result = await miniProgramSao.getSessionFromWeixin(code);
		if(result.data.openid && result.data.session_key){
			let user = await miniProgramSao.findClientUser({openid: result.data.openid});
			if(user){
				ctx.body = {
					code: 0,
					data: {
						openid: result.data.openid
					},
					message:'success'
				};
			}else{
				let addNewUser = await miniProgramSao.addNewClientUser({openid:result.data.openid});
				if(addNewUser){
					ctx.body = {
						code: 0,
						data: {
							openid: result.data.openid
						},
						message:'success'
					};
				}else{
					ctx.body = {
						code: -1,
						data: result.data,
						message:'fail'
					}
				}
			}
			
		}else{
			ctx.body = {
				code: -1,
				data: result.data,
				message:'fail'
			}
		}
		
	}catch(e){
		ctx.body={
			code: -2,
			message:'error'
		}
	}
});


router.get('/syncUserInfo',async ctx =>{
	try{
		let result = miniProgramSao.syncClientUser(ctx.query);
		if(result){
			ctx.body = {
				code:0,
				message:'success',
				data:result
			}
		}else{
			ctx.body = {
				code: -1,
				message:'fail'
			}
		}
		
	}catch(e){
		ctx.body = {
			code : -2,
			message:'error'
		}
	}
	
	
});







module.exports = router;