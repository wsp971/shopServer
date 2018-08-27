
const crypto = require('crypto');
const md5 = crypto.createHash('md5');//返回哈希算法

exports.md5 = function(enStr){
	let md5Sum = md5.update(enStr);
	return md5Sum.digest('hex');
};
