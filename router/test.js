
var crypto = require('crypto');

var md5 = crypto.createHash('md5');//返回哈希算法

var md5Sum = md5.update('wangshiping5');//指定要摘要的原始内容,可以在摘要被输出之前使用多次update方法来添加摘要内容

var result = md5Sum.digest('hex');//摘要输出，在使用digest方法之后不能再向hash对象追加摘要内容。

console.log(result);