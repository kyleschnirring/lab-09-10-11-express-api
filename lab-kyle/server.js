'use strict';

// node modules
const express = require('express');
const debug = require('debug')('demo:server');
const morgan = require('morgan');

// app modules
const Storage = require('./lib/storage');
const errorResponse = require('./lib/error-response');

// globals
const app = express();
const port = process.env.PORT || 3000;
const baseStorageDir = process.env.STORAGE_DIR || `${__dirname}/data`;
const appStorage = new Storage(baseStorageDir);

// middleware
app.use(errorResponse);
app.use(morgan('dev'));

// routes
const userRouter = require('./route/user-router')(appStorage);
app.use('/api/user', userRouter);

const noteRouter = require('./route/note-router')(appStorage);
app.use('/api/note', noteRouter);

const listRouter = require('./route/list-router')(appStorage);
app.use('/api/list', listRouter);

app.get('*', function(req, res){
  debug('* 404');
  res.json('404 not found');
});

// start app
const server = app.listen(port, function(){
  debug('app.listen');
  console.log('server up ->', port);
});

server.isRunning = true;
module.exports = server;
