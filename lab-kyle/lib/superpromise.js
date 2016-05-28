'use strict';

const Promise = require('bluebird');

module.exports = function(request){
  return new Promise(function (resolve, reject){
    request.end(function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
