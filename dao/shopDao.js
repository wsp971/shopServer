const shopModel = require('../db').shopModel;

exports.insertShop = async function(shopObj){
	return new Promise( (resolve,reject)=>{
		let shopInstance = new shopModel(shopObj);
		shopInstance.save((err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};


exports.queryShop = async function(pageIndex,pageSize){
	pageSize = pageSize || 10;
	return new Promise((resolve,reject)=>{
		shopModel.find().skip(pageSize * pageIndex).limit(Math.floor(pageSize)).sort({'_id':-1}).exec((err,result)=>{
			if(err){
				console.log(err);
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};

exports.shopCount = async function(){
	return new Promise( (resolve, reject)=>{
		shopModel.count({},(err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		})
	});
};


exports.queryShopByCondition = async function(shop){
	return new Promise((resolve,reject)=>{
		shopModel.find(shop).exec((err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};


exports.updateShop = async function(shop, newshop){
	return new Promise( (resolve, reject) =>{
		shopModel.updateOne(shop,newshop,(err, result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};

exports.deleteShop = async function(shop){
	return new Promise( (resolve, reject) =>{
		shopModel.deleteOne(shop,(err, result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};
