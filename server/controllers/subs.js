'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    _ = require('underscore');

module.exports = function(app){
  app.use('/', router);
};

router.post('/api/subs/toggle', function(req, res){
  db.User.find(req.user.id)
  .success(function(user){
    db.Feed.find(req.body.feedid)
    .success(function(feed){
      user.hasSubscribed(feed)
      .success(function(result){
        if(result){
          user.removeSubscribed(feed);
        } else {
          user.addSubscribed(feed); 
        }
        res.json({subscribed:!result});
      });
    })
  });
});

router.post('/api/subs/all', function(req, res){
  db.User.find(req.user.id)
  .success(function(user){
    db.Feed.findAll()
    .success(function(feeds) {
      _.each(feeds, function(feed){
        user.hasSubscribed(feed)
        .success(function(result){
          if(!result){
            user.addSubscribed(feed);
          }
        });
      });
      res.json({error:false});
    });
  });
});