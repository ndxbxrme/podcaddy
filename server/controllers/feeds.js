'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models');

module.exports = function(app){
  app.use('/', router);
};

router.post('/feeds/all', function(req, res){
  db.Feed.findAll().success(function(feeds){
    res.json(feeds);
  });
});

router.post('/api/feeds/all', function(req, res){
  console.log("it's a me");
  db.Feed.findAll({include:[{model:db.User, as:'Subscribed', where:{id:req.user.id}, required:false}]}).success(function(feeds){
    res.json(feeds);
  }); 
});