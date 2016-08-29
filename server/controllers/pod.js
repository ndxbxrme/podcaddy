'use strict';

var Pod = require('../models/pod'),
    Item = require('../models/item'),
    request = require('request'),
    xml2js = require('xml2js'),
    S = require('string'),
    _ = require('underscore'),
    cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

//UTILITY FUNCTIONS
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
  return image;
};

var extractFeedImage = function(feed){
  var image;
  if(feed['itunes:image'] && feed['itunes:image'].length > 0 && feed['itunes:image'][0].$ && feed['itunes:image'][0].$.href) {
    image = feed['itunes:image'][0].$.href; 
  }
  else if(feed['media:thumbnail'] && feed['media:thumbnail'].length > 0 && feed['media:thumbnail'][0].$ && feed['media:thumbnail'][0].$.url && feed['media:thumbnail'][0].$.url.length>0) {
    image = feed['media:thumbnail'][0].$.url[0];
  }
  else if(feed.image && feed.image.length > 0 && feed.image[0].url && feed.image[0].url.length > 0){
    image = feed.image[0].url[0]; 
  }
  else image = extractItemImage(feed.item[0]);
  return image;
};

function checkValidItem(item)
{
  return item.enclosure && item.enclosure.length>0 && item.enclosure[0].$.url;
}

function checkValidFeed(feed)
{
  return feed && feed.rss && feed.rss.channel && feed.rss.channel.length > 0 && feed.rss.channel[0].item && feed.rss.channel[0].item.length > 0;
}

function dbImg(imgsrc)
{
  if(imgsrc && imgsrc.match(/\/[^\/]+$/)) {
    return imgsrc.match(/\/[^\/]+$/)[0];
  }
  return '';
}

//END UTILITY FUNCTIONS

var updateFeedItems = function(feed, pod, callback) {
  _.each(feed.item, function(item){
    if(checkValidItem(item)){
      var d = S((item.description&&item.description.length>0)?item.description[0]:'')
      .replace(/<!\[CDATA|]]>/g,'').stripTags().decodeHTMLEntities();
      var t = S((item.title&&item.title.length>0)?item.title[0]:'')
      .replace(/<!\[CDATA|]]>/g,'').stripTags().decodeHTMLEntities().truncate(255);
      var s = S((item['itunes:subtitle']&&item['itunes:subtitle'].length>0)?item['itunes:subtitle'][0]:'')
      .replace(/<!\[CDATA|]]>/g,'').stripTags().decodeHTMLEntities().truncate(255);
      var url = item.enclosure[0].$.url;
      Item.findOne({url:url}, function(err, dbitem) {
        if(err) {
          throw err; 
        }
        if(dbitem) {
          dbitem.updatedAt = Date.now();
          dbitem.save(function(err){
            if(err) {
              throw err; 
            }
          });
        }
        else {
          var newItem = new Item();
          newItem.url = url;
          newItem.title = t.s;
          newItem.shortDesc = d.truncate(255).s;
          newItem.description = d.s;
          newItem.subtitle = s.s;
          newItem.pubDate = Date.parse(item.pubDate);
          newItem.podSlug = pod.titleSlug;
          newItem.podTitle = pod.title;
          newItem.podLink = pod.link;
          var imgsrc = extractItemImage(item);
          console.log(dbImg(imgsrc) + ', ' + pod.image);
          if(!imgsrc || imgsrc==='' || dbImg(imgsrc)===pod.image) {
            newItem.image = pod.image;
            newItem.cloudinary = pod.cloudinary;
            newItem.save(function(err){
              if(err) {
                throw err; 
              }
            });
          }
          else {
            Item.find({podSlug:pod.titleSlug, image:dbImg(imgsrc)})
            .exec(function(err, imgItems) {
              if(err) {
                throw err; 
              }
              if(imgItems && imgItems.length>0) {
                newItem.image = imgItems[0].image;
                newItem.cloudinary = imgItems[0].cloudinary;
                newItem.save(function(err){
                  if(err) {
                    throw err; 
                  }
                });
              }
              else {
                newItem.image = pod.image;
                newItem.cloudinary = pod.cloudinary;
                newItem.save(function(err){
                  if(err) {
                    throw err; 
                  }
                });
                /*
                console.log('uploading image ' + dbImg(imgsrc));
                cloudinary.uploader.upload(
                  imgsrc,
                  function(cRes) {
                    if(!cRes.error) {
                      newItem.image = dbImg(imgsrc);
                      newItem.cloudinary = cRes;
                      newItem.save(function(err){
                        if(err) {
                          throw err; 
                        }
                      });
                    }
                    else {
                      newItem.image = dbImg(pod.image);
                      newItem.cloudinary = pod.cloudinary;
                      newItem.save(function(err){
                        if(err) {
                          throw err; 
                        }
                      });
                    }
                  },
                  {
                    crop: 'thumb',
                    width: 200,
                    height: 200,
                    tags: ['podcast','item_image']
                  }
                );
                */
              }
            });
          }
        }
      });
    }
  });
};

var checkFeed = function(url, callback) {
  console.log('checking feed: ' + url);
  var options = {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.103 Safari/537.36'
    }
  };
  request(options, function(err, res, body) {
    if(body) {
      var parser = new xml2js.Parser();
      parser.parseString(body, function(err, data){
        if(err) {
          console.log('parser error', url, err);
          console.log(body);
        }
        if(checkValidFeed(data)) {
          Pod.findOne({url:url}, function(err, pod) {
            if(err) {
              throw err; 
            }
            var feed = data.rss.channel[0];
            var imgsrc = extractFeedImage(feed);
            var categories = [];
            if(feed['itunes:category']) {
              _.each(feed['itunes:category'], function(item){
                if(item && item.$ && item.$.text) {
                  categories.push(item.$.text.toLowerCase()); 
                }
              });
            }
            else if(feed.category) {
              _.each(feed.category, function(item){
                if(item) {
                  if(item.$ && item.$.text) {
                    categories.push(item.$.text.toLowerCase());
                  }
                  else {
                    categories.push(item.toString()); 
                  }
                }
              });               
            }
            var d = S((feed.description&&feed.description.length>0)?feed.description[0]:'')
            .replace(/<!\[CDATA|]]>/g,'').stripTags().decodeHTMLEntities();
            var t = S((feed.title&&feed.title.length>0)?feed.title[0]:'')
            .replace(/<!\[CDATA|]]>/g,'').stripTags().decodeHTMLEntities().truncate(255);
            if(pod && feed && feed.item && feed.item.length>0 && feed.item[0].pubDate) {
              //update pod stats
              pod.link = feed.link;
              pod.title = t.s;
              pod.description = d.s;
              pod.shortDesc = d.truncate(255).s;
              pod.pubDate = Date.parse(feed.item[0].pubDate[0]);
              pod.updatedAt = new Date();
              pod.categories = categories;
              console.log('saving pod data');
              pod.save(function(err){
                if(err) {
                  throw err; 
                }
                updateFeedItems(feed, pod);
                if(callback) {
                  return callback(pod);
                }
              });
              //}
            }
            else if(feed && feed.item && feed.item.length>0 && feed.item[0].pubDate) {
              var newPod = new Pod(); 
              newPod.url = url;
              newPod.link = feed.link;
              newPod.title = t.s;
              newPod.titleSlug = t.truncate(30).slugify();
              newPod.description = d.s;
              newPod.shortDesc = d.truncate(255).s;
              newPod.pubDate = Date.parse(feed.item[0].pubDate[0]);
              newPod.categories = categories;
              cloudinary.uploader.upload(
                imgsrc,
                function(cRes) {
                  if(!cRes.error) {
                    newPod.image = dbImg(imgsrc);
                    newPod.cloudinary = cRes;
                    newPod.save(function(err){
                      if(err) {
                        throw err; 
                      }
                      updateFeedItems(feed, newPod);
                      if(callback) {
                        return callback(newPod);
                      }
                    });
                  }
                  else {
                    cloudinary.uploader.upload(
                      'https://unsplash.it/200/200/?random',
                      function(cRes1) {
                        newPod.image = dbImg(imgsrc);
                        newPod.cloudinary = cRes1;
                        newPod.save(function(err) {
                          if(err) {
                            throw err;   
                          }
                          updateFeedItems(feed, newPod);
                          if(callback) {
                            return callback(newPod);
                          }
                        });
                      }, {
                        tags: ['podcast','feed_image'] 
                      }
                    ); 
                  }
                },
                {
                  crop: 'thumb',
                  width: 200,
                  height: 200,
                  tags: ['podcast','feed_image']
                }
              );
            }
            else {
              console.log('couldn\'t save it', url); 
            }
          });
        }
        else {
          //not a valid feed 
          console.log('not a valid feed', url, checkValidFeed(data), data);
          if(callback) {
            return callback();
          }
        }
      });
    }
    else {
      //no body 
      if(callback) {
        return callback();
      }
    }
  });
};

module.exports.checkFeed = checkFeed;

module.exports.fetchAll = function(req, res) {
  Pod.find().lean().exec(function(err, pods) {
    if(err) {
      throw err; 
    }
    for(var f=0; f<pods.length; f++) {
      if(req.user) {
        if(_.findWhere(pods[f].subscribers,{userId:req.user._id.toString()})) {
          pods[f].subscribed = true; 
        }
      }
      pods[f].noSubscribers = pods[f].subscribers.length;
      pods[f].subscribers = undefined;
    };
    res.json(pods);
  });
};

module.exports.fetchSubs = function(req, res) {
  Pod.find({'subscribers.userId':req.user.id.toString()})
  .lean()
  .exec(function(err, pods) {
    if(err) {
      throw err; 
    }
    for(var f=0; f<pods.length; f++) {
      pods[f].noSubscribers = pods[f].subscribers.length;
      pods[f].subscribers = undefined; 
      pods[f].subscribed = true;
    }
    res.json(pods);
  });
};

module.exports.addPod = function(req, res) {
  checkFeed(req.body.url, function(pod) {
    var subscribed = false;
    if(pod && pod.subscribers) {
      if(_.findWhere(pod.subscribers, {'userId':req.user._id.toString()})) {
        subscribed = true; 
      }
      pod.noSubscribers = pod.subscribers.length;
      pod.subscribers = undefined;
    }
    res.json({feed:pod,subscribed:subscribed,error:pod===undefined});
  });
};

module.exports.toggle = function(req, res) {
  var subscribed = false;
  Pod.findOne({'_id':req.body.podid})
  .exec(function(err,pod) {
    if(err) {
      throw err; 
    }
    if(pod) {
      var sub = _.findWhere(pod.subscribers, {'userId':req.user._id.toString()});
      if(sub) {
        pod.subscribers.remove(sub); 
        subscribed = false;
      }
      else {
        pod.subscribers.push({userId:req.user._id}); 
        subscribed = true;
      }
      pod.save(function(err){
        if(err) {
          throw err; 
        }
      });
    }
    else {
    }
    res.json({subscribed:subscribed});
  });
};


function updateStats(pod) {
  if(!pod) {
    return; 
  }
  pod.listensToday = pod.listensWeek = pod.listensAlltime = 0;
  var today = new Date();
  var week = new Date();
  today.setDate(today.getDate()-1);
  week.setDate(week.getDate()-7);
  Item.find({podSlug:pod.titleSlug})
  .exec(function(err, items) {
    if(err) {
      throw err; 
    }
    if(items) {
      _.each(items, function(item) {
        _.each(item.listened, function(listen){
          if(listen.date > today) {
            pod.listensToday++; 
          }
          if(listen.date > week) {
            pod.listensWeek++;
          }
          pod.listensAlltime++;
        });
      });
      pod.save(function(err){
        if(err) {
          throw err; 
        }
        console.log('saved stats for ' + pod.titleSlug);
      });
    }
  });
  
}

function refreshFeeds() {
  var now = new Date();
  now.setHours(now.getHours()-1);
  Pod.find({updatedAt:{$lt:now}})
  .exec(function(err, pods){
    if(err) {
      throw err; 
    }
    if(pods) {
      console.log('refreshing ' + ((pods)?pods.length:'0') + ' feeds at ' + (new Date()));
      var count = 0;
      _.each(pods, function(pod){
        if(count++ < 20) {
          checkFeed(pod.url, updateStats); 
        }
      });
    }
  });
}


setInterval(refreshFeeds, 1000 * 60 * 3);
refreshFeeds();