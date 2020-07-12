const miniProgramUserModel = require('../db').clientUserModel;
const dishModel = require('../db').dishModel;



/**
 * 添加用户的喜欢食品
 * @param openId 用户的openId
 * @param foodId 食品的编号id
 * @param type 1:喜欢，2，取消喜欢
 */
exports.addMyFavFood = function (openId, foodId, type) {
  return new Promise((resolve, reject) => {
    miniProgramUserModel.findOne({ openid: openId }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        if (type == 1) {
          const index = doc.favDishes.indexOf(foodId);
          console.log('find dish index', index);
          if (index > -1) {
            reject(new Error('您已经喜欢过该菜品了！'))
            return;
          }
          doc.favDishes.push(foodId);
        } else {
          doc.favDishes = doc.favDishes.filter(food => food != foodId);
        }
        doc.save((err, result) => {
          if (!err) {
            resolve()
          } else {
            reject(err);
          }
        })
      }
    })
  })
}


/**
 * 添加用户的不喜欢的食品
 * @param openId 用户的openId
 * @param foodId 食品的编号id
 */
exports.addMyDisLikeFood = function (openId, foodId) {
  return new Promise((resolve, reject) => {
    miniProgramUserModel.findOne({ openid: openId }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        const index = doc.disFavDishes.indexOf(foodId);
        console.log('find dish index', index);
        if (index == -1) {
          doc.disFavDishes.push(foodId);
        }
        doc.save((err, result) => {
          if (!err) {
            resolve()
          } else {
            reject(err);
          }
        })
      }
    })
  })
}

/**
 * 添加用户的收藏店铺
 * @param openId 用户的openId
 * @param shopId 店铺id 
 * @param type  店铺id 1： 收藏； 2：取消收藏
 */
exports.addMyFavShop = function (openId, shopId, type) {
  console.log('addMyFavShop', openId, shopId, type)
  return new Promise((resolve, reject) => {
    miniProgramUserModel.findOne({ openid: openId }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        if (type == 1) {
          const index = doc.favShops.indexOf(shopId);
          console.log('find shop index', index);
          if (index > -1) {
            reject(new Error('您已经收藏过该店铺了！'))
            return;
          }
          doc.favShops.push(shopId);
        } else {
          console.log('before', doc.favShops);
          doc.favShops = doc.favShops.filter(shop => shop != shopId);
          console.log(doc.favShops, shopId, 'after');
        }
        doc.save((err, result) => {
          if (!err) {
            resolve()
          } else {
            reject(err);
          }
        })
      }
    })
  })
}