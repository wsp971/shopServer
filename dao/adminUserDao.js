const adminUserModel = require('../db').adminLoginUserModel;

exports.insertAdminUser = async function(newUserObj){
	return new Promise( (resolve,reject)=>{
		let adminUserInstance = new adminUserModel(newUserObj);
		adminUserInstance.save((err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};

exports.login = async function(userObj){
	return new Promise((resolve,reject)=>{
		adminUserModel.find(userObj,(err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};



