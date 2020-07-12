const shopModel = require('../db').shopModel;


/**
 * 新增店铺
 */
exports.insertShop = async function (shopObj) {
  return new Promise((resolve, reject) => {
    let shopInstance = new shopModel(shopObj);
    shopInstance.save((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * 分页查询店铺
 */
exports.queryShop = async function (pageIndex, pageSize) {
  pageSize = pageSize || 10;
  return new Promise((resolve, reject) => {
    shopModel.find().skip(pageSize * pageIndex).limit(Math.floor(pageSize)).sort({ '_id': -1 }).exec((err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * 根据shopid 批量查询店铺
 * @param shopIds -{Array} 店铺id 数组
 */
exports.queryShopByIds = function (shopIds) {
  console.log('shopid', shopIds);
  return new Promise((resolve, reject) => {
    shopModel.find().where('id').in(shopIds).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}


/**
 * 统计店铺数量
 */
exports.shopCount = async function () {
  return new Promise((resolve, reject) => {
    shopModel.count({}, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
};


/**
 * 根据条件查询店铺
 */
exports.queryShopByCondition = async function (shop) {
  return new Promise((resolve, reject) => {
    shopModel.find(shop).exec((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * 更新店铺内容
 * @param shop 店铺查询字段
 * @param newShop 更新店铺内容
 * 
 */
exports.updateShop = async function (shop, newshop) {
  return new Promise((resolve, reject) => {
    shopModel.updateOne(shop, newshop, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * 删除店铺
 * @param shop {object} 删除的店铺chaxun 信息
 */
exports.deleteShop = async function (shop) {
  return new Promise((resolve, reject) => {
    shopModel.deleteOne(shop, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
