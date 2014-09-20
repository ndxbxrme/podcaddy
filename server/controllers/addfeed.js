'use strict';

var express = require('express'),
    request = require('request'),
    xml2js = require('xml2js'),
    q = require('q'),
    db = require('../models'),
    _ = require('underscore'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

var addUpdateFeed = function(feed, url, userId){
  var defer = q.defer();
  var imgsrc;
  if(feed['itunes:image'] && feed['itunes:image'].length>0) {
      imgsrc = feed['itunes:image'][0]['$'].href;   
  }
  else if(feed.image && feed.image.length>0) {
      imgsrc = feed.image[0].url[0];   
  }
  var categories = [];
  _.each(feed['itunes:category'], function(item){
      categories.push(item.$.text); 
  });
  var feeddata = {
      title: feed.title[0],
      description: feed.description[0],
      image: imgsrc,
      pubDate: feed.item[0].pubDate,
      categories: categories
  };
  console.dir(feeddata);
  db.User.find(userId)
  .success(function(user){
    if(user) {
      db.Feed.findOrCreate({url:url}, {data:feeddata, pubDate:feeddata.pubDate, UserId:user.id})
      .success(function(dbfeed, created){
        updateFeedItems(feed, dbfeed, user);
        //dbfeed.addSubscribed(user);
        dbfeed.updateAttributes({data: feeddata, pubDate: feeddata.pubDate});
        defer.resolve(dbfeed);
      });
    }
  });
  return defer.promise;
};

var updateFeedItems = function(feed, dbfeed, user) {
  _.each(feed.item, function(item){
    db.Item.findOrCreate({url: item.enclosure[0].$.url, FeedId: dbfeed.id}, {pubDate: item.pubDate, data:item})
    .success(function(dbitem, created){
      console.log('did something, ' + created);
    });
  });
};

router.post('/api/addfeed', function(req, res) {
  var options = {
    url: req.body.url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.103 Safari/537.36'
    }
  };
  request(options, function(err, response, body){
    var parser = new xml2js.Parser();
    parser.parseString(body, function(err, data){
      addUpdateFeed(data.rss.channel[0], req.body.url, req.user.id)
      .then(function(feed){
        res.json(_.omit(feed));
      });
    });
  });
});