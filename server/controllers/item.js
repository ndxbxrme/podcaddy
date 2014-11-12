'use strict';

var Item = require('../models/item'),
    User = require('../models/user'),
    Pod = require('../models/pod'),
    _ = require('underscore');

module.exports.fetchSubs = function(req, res){
  var now = new Date();
  switch(req.params.period) {
    case 'day':
      now.setDate(now.getDate() - 1);
      break;
    case 'week':
      now.setDate(now.getDate() - 7);
      break;
    case 'month':
      now.setDate(now.getDate() - 31);
      break;
    case 'year':
      now.setDate(now.getDate() - 365);
      break;
    case 'alltime':
      now = new Date(1970,1,1);
      break;
  }  
  var fetchItems = function(slugs) {
    Item.find({podSlug:{$in:slugs}})
    .where({pubDate:{$gt:now}})
    .lean()
    .exec(function(err, items){
      if(err) {
        throw err; 
      }
      _.each(items, function(item){
        item.noListened = item.listened.length;
        item.noSkipped = item.skipped.length;
        item.listened = _.findWhere(item.listened, {userId:req.user._id.toString()})!==undefined;
        item.skipped = _.findWhere(item.skipped, {userId:req.user._id.toString()})!==undefined;
      });
      res.json({items:items});
    });
  };
  User.findOne({'_id':req.user._id})
  .exec(function(err, user){
    if(req.params.feed !== 'all') {
      return fetchItems([req.params.feed]);
    }
    else {
      if(req.params.playlist !== 'none') {
        
      }
      else {
        Pod.find({'subscribers.userId':req.user._id.toString()})
        .exec(function(err, pods){
          var slugs = [];
          _.each(pods, function(pod){
            slugs.push(pod.titleSlug);
          });
          return fetchItems(slugs);
        });
      }
    }
  });
};

module.exports.skipItem = function(req, res) {
  Item.findById(req.body.itemid)
  .exec(function(err, item){
    item.skipped.push({userId:req.user._id});
    item.save(function(err){
      if(err) {
        throw err; 
      }
      res.send('skipped');
    });
  });
};

module.exports.reportPosition = function(req, res) {
  User.findById(req.user._id)
  .exec(function(err, user){
    if(err) {
      throw err; 
    }
    user.currentItem = req.body.itemid;
    user.currentPosition = req.body.position;
    user.save(function(err){
      if(err) {
        throw err; 
      }
    });
    if(req.body.history) {
      Item.findById(req.body.itemid)
      .exec(function(err, item){
        if(!_.findWhere(item.listened, {userId:req.user._id.toString()})) {
          item.listened.push({userId:req.user._id});
          item.save(function(err){
            if(err) {
              throw err; 
            }
          });
        }
      });
    }
    res.send('nice!');
  });
};