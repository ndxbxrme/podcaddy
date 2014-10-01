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

router.post('/api/feeds/subs', function(req, res){
  db.Feed.findAll({include:[{model:db.User, as:'Subscribed', where:{id:req.user.id},required:true}]}).success(function(feeds){
    res.json(feeds);
  });
});

router.post('/api/feeds/add', function(req, res) {
  da.checkFeed(req.body.url)
  .then(function(feed){
    db.Feed.find({where:{id:feed.id},include:[{model:db.User, as:'Subscribed', attributes:['id'], where:{id:req.user.id},required:false}]}).success(function(subfeed){
      if(subfeed){
        res.json(subfeed);
      } else {
        res.json({error:true}); 
      }
    });
  }, function(err){
    res.json({error:true});
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
    var count = 0;
    _.each(feeds, function(feed){
      if(count++ < 20) {
        da.checkFeed(feed.url);
      }
    });
  });
}

setInterval(refreshFeeds, 1000 * 60 * 3);
//refreshFeeds();

router.post('/api/feeds/init', function(req, res) {

  importFeeds(0);
  res.json({message:'import done'});
  /*_.each(sf.feeds, function(feed){
    console.log(feed);
    da.checkFeed(feed, req.user.id)
    .catch(function(err){
      console.log(err);
    });
  });*/
});