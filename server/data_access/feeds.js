'use strict';

var db = require('../models'),
    q = require('q'),
    request = require('request'),
    xml2js = require('xml2js'),
    _ = require('underscore');

var extractItemImage = function(item){
  var image;
  if(item['media-thumbnail'] && item['media-thumbnail'].length > 0 && item['media-thumbnail'][0].$ && item['media-thumbnail'][0].$.media) {
    image = item['media-thumbnail'][0].$.media;
  }
  else if(item['media-thumbnail'] && item['media-thumbnail'].length > 0 && item['media-thumbnail'][0].$ && item['media-thumbnail'][0].$.url) {
    image = item['media-thumbnail'][0].$.url;
  }  
  else if(item['itunes:image'] && item['itunes:image'].length > 0 && item['itunes:image'][0].$ && item['itunes:image'][0].$.href) {
    image = item['itunes:image'][0].$.href;
  }  
  /*else if(item.description && item.description.length > 0) {
    var m = item.description[0].match(/<img.*src="([^"]+)/i);
    if(m && m.length>1) {
      image = m[1]; 
    }
  }*/
  return image;
};

var extractFeedImage = function(feed){
  var image;
  if(feed['itunes:image'] && feed['itunes:image'].length > 0 && feed['itunes:image'][0].$ && feed['itunes:image'][0].$.href) {
    image = feed['itunes:image'][0].$.href; 
  }
  else if(feed.image && feed.image.length > 0 && feed.image[0].url && feed.image[0].url.length > 0){
    image = feed.image[0].url[0]; 
  }
  else image = extractItemImage(feed.item[0]);
  return image;
};

var addUpdateFeed = function(feed, url){
  var defer = q.defer();
  var imgsrc = extractFeedImage(feed);
  var categories = [];
  _.each(feed['itunes:category'], function(item){
      categories.push(item.$.text); 
  });
  var feeddata = {
      title: feed.title[0],
      description: feed.description[0],
      image: imgsrc,
      pubDate: feed.item[0].pubDate,
      categories: categories,
      updated: new Date()
  };
  db.Feed.findOrCreate({url:url})
  .success(function(dbfeed, created){
    updateFeedItems(feed, dbfeed, imgsrc);
    dbfeed.updateAttributes({data: feeddata, pubDate: feeddata.pubDate});
    defer.resolve(dbfeed);
  });
  return defer.promise;
};

function checkValidItem(item)
{
  return item.enclosure && item.enclosure.length>0 && item.enclosure[0].$.url;
}

function checkValidFeed(feed)
{
  return feed && feed.rss && feed.rss.channel && feed.rss.channel.length > 0 && feed.rss.channel[0].item && feed.rss.channel[0].item.length > 0;
}

var updateFeedItems = function(feed, dbfeed, feedimage) {
  _.each(feed.item, function(item){
    if(checkValidItem(item)){
      item.image = extractItemImage(item) || feedimage;
      if(item.description && item.description.length>0) {
        item.description[0] = item.description[0].replace(/<!\[CDATA|]]>/g,''); 
      }
      db.Item.findOrCreate({url: item.enclosure[0].$.url, FeedId: dbfeed.id}, {pubDate: item.pubDate, data:item})
      .success(function(dbitem, created){
      });
    }
  });
};

module.exports.checkFeed = function(url)
{
  var defer = q.defer();
  var options = {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.103 Safari/537.36'
    }
  };
  request(options, function(err, response, body){
    if(body){
      var parser = new xml2js.Parser();
      parser.parseString(body, function(err, data){
        if(checkValidFeed(data))
        {
          addUpdateFeed(data.rss.channel[0], url)
          .then(function(feed){
            defer.resolve(feed);
          });
        } else {
          defer.reject({error:true, message:'not a valid feed'}); 
        }
      });
    }
    else {
      defer.reject({error:true, message:'no body'}); 
    }
  });  
  return defer.promise;
};