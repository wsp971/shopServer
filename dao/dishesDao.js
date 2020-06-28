const dishModel = require('../db').dishModel;

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