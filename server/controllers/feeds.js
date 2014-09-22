'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    da = require('../data_access/feeds'),
    sf = require('../config/starterfeeds'),
    _ = require('underscore');

module.exports = function(app){
  app.use('/', router);
};

router.post('/feeds/all', function(req, res){
  db.Feed.findAll().success(function(feeds){
    res.json(feeds);
  });
});

router.post('/api/feeds/all', function(req, res){
  db.Feed.findAll({include:[{model:db.User, as:'Subscribed', where:{id:req.user.id}, required:false}]}).success(function(feeds){
    res.json(feeds);
  }); 
});

router.post('/api/feeds/add', function(req, res) {
  da.checkFeed(req.body.url)
  .then(function(feed){
    res.json(feed);
  }, function(err){
    res.json(err);
  });
});

function importFeeds(userId) {
  _.each(sf.feeds, function(feed){
    da.checkFeed(feed);
  });
}

function refreshFeeds() {
  var now = new Date();
  now.setHours(now.getHours()-1);
  db.Feed.findAll({where:{updatedAt:{lt:now}}})
  .success(function(feeds) {
    _.each(feeds, function(feed){
      da.checkFeed(feed.url);
    });
  });
}

setInterval(refreshFeeds, 1000 * 60 * 5);
//refreshFeeds();

router.post('/api/feeds/init', function(req, res) {

  importFeeds();
  /*_.each(sf.feeds, function(feed){
    console.log(feed);
    da.checkFeed(feed, req.user.id)
    .catch(function(err){
      console.log(err);
    });
  });*/
});