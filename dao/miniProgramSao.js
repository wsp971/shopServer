const miniProgramConfig = require('../config/miniProgramConfig');
const miniProgramUserModel = require('../db').clientUserModel;
const axios = require('axios');
const TIMEOUT = 8000;


exports.getSessionFromWeixin = function(code){
	return new Promise((resolve,reject)=>{
		axios({
			method: 'get',
			url: 'https://api.weixin.qq.com/sns/jscode2session',
			timeout: TIMEOUT,
			params: {
				appid:miniProgramConfig.appid,
				secret:miniProgramConfig.secretKey,
				js_code:code,
				grant_type:'authorization_code'
			}
		}).then(response =>{
			resolve(response);
		}).catch(e=>{
			reject(e);
		})
	});
};



exports.addNewClientUser = function(userObj){
	return new Promise((resolve,reject)=>{
		let userInstance = new miniProgramUserModel(userObj);
		userInstance.save((err,result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};



exports.syncClientUser = function(newUserObj){
	return new Promise((resolve,reject)=>{
		let {openid} = newUserObj;
		miniProgramUserModel.updateOne({openid:openid},newUserObj,(err, result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};



exports.findClientUser = function(userObj){
	return new Promise((resolve,reject)=>{
		miniProgramUserModel.find(userObj,(err, result)=>{
			if(err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
};




