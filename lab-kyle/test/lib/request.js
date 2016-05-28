'use strict';

module.exports = function(baseUrl){
  const request = require('superagent-use');
  const prefix = require('superagent-prefix')(baseUrl);
  const requestPromise = require('superagent-promise-plugin');
  request.use(prefix);
  request.use(requestPromise);
  return request;
};
