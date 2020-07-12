const dishModel = require('../db').dishModel;

// 新增菜品
exports.insertDish = async function (dishObj) {
  return new Promise((resolve, reject) => {
    let dishInstance = new dishModel(dishObj);
    dishInstance.save((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// 分页查询菜品
exports.queryDish = async function (pageIndex, pageSize, queryObj) {
  pageSize = pageSize || 10;
  queryObj = queryObj || {};
  return new Promise((resolve, reject) => {
    dishModel.find(queryObj).skip(pageSize * pageIndex).limit(Math.floor(pageSize)).sort({ '_id': -1 }).exec((err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// 查询单个菜品
exports.queryDishById = async function (id) {
  console.log('id', id);
  const result = await dishModel.findOne({ _id: id });
  return result;
}

exports.batchQueryByIds = async function (ids) {
  console.log('ids', ids);
  return new Promise((resolve, reject) => {
    dishModel.find().where('_id').in(ids).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

// 更新菜品内容
exports.updateDish = async function (id, dish) {
  const result = await dishModel.findOneAndUpdate({
    _id: id
  }, dish)
  return result
}

// 删除菜品
exports.deleteDish = async function (dish) {
  return new Promise((resolve, reject) => {
    dishModel.deleteOne(dish, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// 统计菜品数量
exports.dishCount = async function (queryObj) {
  return new Promise((resolve, reject) => {
    dishModel.count(queryObj, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
};


exports.queryDishByHeat = function (type = 'middle') {
  let left, right;
  if (type == 'small') {
    left = 0; right = 100;
  } else if (type == 'middle') {
    left = 100, right = 200;
  } else {
    left = 200; right = 10000;
  }
  return new Promise((resolve, reject) => {
    dishModel.find().where('heatQuatity').gte(left).lte(right).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}