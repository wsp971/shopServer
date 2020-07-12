var crypto = require('crypto')
const config = require('../config/miniProgramConfig');
const miniProgramSao = require('../dao/miniProgramSao');
class WXBizDataCrypt {
  constructor(openid) {
    this.appid = config.appid;
    this.openid = openid;
  }
  async getWeixinSessionKey() {
    const user = await miniProgramSao.findClientUser({
      openid: this.openid
    })
    console.log('queryuser', user);
    this.sessionKey = user[0].sessionKey;
  }

  async decryptData(encryptedData, iv) {
    try {
      await this.getWeixinSessionKey();
      console.log('sessionkey', this.sessionKey)
      var sessionKey = new Buffer(this.sessionKey, 'base64')
      encryptedData = new Buffer(encryptedData, 'base64')
      iv = new Buffer(iv, 'base64')
      // 解密
      var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      var decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')

      decoded = JSON.parse(decoded)

    } catch (err) {
      throw new Error('Illegal Buffer', err);
    }
    console.log('decoded', decoded.watermark.appid, this.appid)
    if (decoded.watermark.appid !== this.appid) {
      throw new Error('Illegal Buffer !!!!')
    }
    return decoded
  }
}

module.exports = WXBizDataCrypt
