(function() {
  'use strict';
  var ObjectID, alasql, dbname, deleteAll, fs, makeDb, readKeys, s3;

  dbname = 'pc';

  s3 = require('./s3')(dbname);

  alasql = require('alasql');

  fs = require('fs');

  ObjectID = require('bson-objectid');

  console.log('yo');

  deleteAll = function() {
    return s3.keys(null, dbname + ':', function(e, r) {
      var count, i, key, len, ref;
      if (e) {
        return console.log('error', e);
      }
      console.log('response', r);
      if (!e && r && r.Contents) {
        count = 0;
        ref = r.Contents;
        for (i = 0, len = ref.length; i < len; i++) {
          key = ref[i];
          s3.del(key.Key, function(e) {
            return console.log(++count + '/' + r.Contents.length, 'delete error?', e);
          });
        }
      }
      if (r.IsTruncated) {
        return deleteAll();
      }
    });
  };

  makeDb = function() {
    var distinctUrls, feed, feedExists, feedsJson, i, j, k, len, len1, len2, sub, subs, subsJson, url, user, users;
    alasql('CREATE DATABASE podcaddy');
    alasql('USE podcaddy');
    alasql('CREATE TABLE u');
    alasql('CREATE TABLE f');
    alasql('CREATE TABLE s');
    alasql('CREATE TABLE i');
    alasql('CREATE TABLE l');
    users = JSON.parse(fs.readFileSync('./data/users.json'));
    for (i = 0, len = users.length; i < len; i++) {
      user = users[i];
      alasql('INSERT INTO u VALUES ?', [user]);

      /*
      s3.put dbname + ':u/' + user._id, user, (e, r) ->
        if e then return console.log 'error'
        console.log 'user inserted into s3'
       */
    }
    feedsJson = JSON.parse(fs.readFileSync('./data/pods_processed.json'));
    distinctUrls = alasql('SELECT DISTINCT(title + description) AS url FROM ?', [feedsJson]);
    for (j = 0, len1 = distinctUrls.length; j < len1; j++) {
      url = distinctUrls[j];
      feed = alasql('SELECT _id as i, title as t, slug as s, description as d, url as u, link as l, image as im, imageUrl as iu, categories as c, pubDate as p, updated as up FROM ? WHERE (title+description)=?', [feedsJson, url.url]);
      if (feed && feed.length) {
        feedExists = alasql('SELECT * FROM f WHERE t=? AND d=?', [feed.t, feed.d]);
        if (feedExists && feedExists.length) {
          console.log('DUPLICATE:', feed.t);
        } else {
          alasql('INSERT INTO f VALUES ?', [feed[0]]);

          /*
          s3.put dbname + ':f/' + feed[0].i, feed[0], (e, r) ->
            if e then return console.log 'error'
            console.log 'feed inserted into s3'
           */
          if (feed.length > 1) {
            console.log(feed[0].t);
          }
        }
      }
    }
    subsJson = JSON.parse(fs.readFileSync('./data/subs_processed.json'));
    subs = alasql('SELECT pid as f, uid as u, d FROM ?', [subsJson]);
    for (k = 0, len2 = subs.length; k < len2; k++) {
      sub = subs[k];
      sub.i = ObjectID.generate();
      alasql('INSERT INTO s VALUES ?', [sub]);

      /*
      s3.put dbname + ':s/' + sub.i, sub, (e, r) ->
        if e then return console.log 'error'
        console.log 'sub inserted into s3'
       */
    }
    return s3.put(dbname + ':database', alasql.databases.podcaddy.tables, function(e) {
      if (!e) {
        return console.log('database uploaded');
      }
    });
  };

  readKeys = function() {
    return s3.keys(null, function(e, r) {
      if (e) {
        return console.log('error', e);
      }
      return console.log('response', r);
    });
  };

  makeDb();

}).call(this);

//# sourceMappingURL=aws.js.map
