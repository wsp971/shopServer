const userModel = require('../db').userModel;

exports.insertUser = async function(userObj){
	return new Promise( (resolve,reject)=>{
		let userInstance = new userModel(userObj);
		userInstance.save((err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};


exports.queryUser = async function(user){
	return new Promise((resolve,reject)=>{
		userModel.find(user,(err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};

exports.updateUser = async function(user, newUser){
	return new Promise( (resolve, reject) =>{
		userModel.updateOne(user,newUser,(err, result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};


