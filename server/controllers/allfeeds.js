'use strict';

var express = require('express'),
    db = require('../models'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.post('/api/allfeeds', function(req, res){
  db.Feed.findAll().success(function(feeds){
    res.json(feeds);
  });
});