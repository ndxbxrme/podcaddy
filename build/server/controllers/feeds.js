(function() {
  'use strict';
  module.exports = function(app, database, socket) {
    var doPoll, feedsService;
    feedsService = require('../services/feeds.js')(database, socket);
    doPoll = function() {
      return feedsService.pollFeeds(function() {
        console.log('POLL CALLBACK');
        return setTimeout(doPoll, 60 * 1000);
      });
    };
    doPoll();
    app.post('/api/pods', function(req, res) {
      var data, props, subsJoin, where;
      data = [];
      props = [];
      where = '';
      subsJoin = '';
      if (req.body.feedSlug) {
        props.push(new Date('2001/01/01').valueOf());
        props.push(new Date().valueOf());
        props.push(req.body.feedSlug);
        where = ' AND f.s=? ';
      } else {
        if (req.user) {
          props.push(new Date().setHours(new Date().getHours() - (24 * 7)).valueOf());
          props.push(new Date().valueOf());
          props.push(req.user._id);
          where = ' AND s.u=? ';
          subsJoin = ' LEFT JOIN s ON i.f=s.f ';
        } else {
          props.push(new Date().setHours(new Date().getHours() - 24).valueOf());
          props.push(new Date().valueOf());
          where = '';
        }
      }
      if (!req.user) {
        data = database.exec('SELECT i.t as title, i.d as description, i.u as url, i.l as length, i.p as pubDate, i.s as slug, f.t AS feedTitle, f.iu as imageUrl, f.s as feedSlug, f.c as categories FROM i LEFT JOIN f on i.f=f.i WHERE i.p > ? AND i.p < ? ' + where + ' ORDER BY i.p DESC', props);
      } else {
        data = database.exec('SELECT i.i as _id, i.t as title, i.d as description, i.u as url, i.l as length, i.p as pubDate, i.s as slug, f.t AS feedTitle, f.iu as imageUrl, f.s as feedSlug, f.c as categories, l.d as listened FROM i LEFT JOIN f on i.f=f.i ' + subsJoin + ' LEFT JOIN l ON l.p=i.i WHERE i.p > ? AND i.p < ? ' + where + ' ORDER BY i.p DESC', props);
      }
      return res.json(data);
    });
    app.post('/api/feeds', function(req, res) {
      var data, props;
      props = [];
      if (req.user) {
        props.push(req.user._id);
      } else {
        props.push('nobody');
      }
      data = database.exec('SELECT f.i AS feedId, f.t AS feedTitle, f.d AS feedDescription, f.iu as imageUrl, f.s as feedSlug, f.c as categories, s.d as subscribed FROM f LEFT JOIN s ON s.f=f.i AND s.u=? ORDER BY f.t ASC', props);
      return res.json(data);
    });
    app.post('/api/report-listen', function(req, res) {
      var prevListen;
      if (req.user && req.body.podId) {
        prevListen = database.exec('SELECT * FROM l WHERE p=? AND u=?', [req.body.podId, req.user._id]);
        if (prevListen && prevListen.length) {

        } else {
          database.exec('INSERT INTO l VALUES ?', [
            {
              i: ObjectID.generate(),
              p: req.body.podId,
              u: req.user._id,
              d: new Date().valueOf()
            }
          ]);
        }
      }
      return res.end('OK');
    });
    app.post('/api/subscribe', function(req, res) {
      if (req.user && req.body.feedId) {
        feedsCtrl.subscribe(req.user._id, req.body.feedId);
      }
      return res.end('OK');
    });
    app.post('/api/unsubscribe', function(req, res) {
      if (req.user && req.body.feedId) {
        database.exec('UPDATE s SET f=? WHERE u=? AND f=?', ['.', req.user._id, req.body.feedId]);
      }
      return res.end('OK');
    });
    return app.post('/api/add-feed', function(req, res) {
      if (req.user._id && req.body.feedUrl) {
        return feedsCtrl.addFeed(req.user._id, req.body.feedUrl, function(err, feed) {
          if (err) {
            if (feed) {
              feed.error = err;
              return res.json(feed);
            } else {
              return res.json({
                error: err
              });
            }
          } else {
            return res.json(feed);
          }
        });
      } else {
        return res.end('OK');
      }
    });
  };

}).call(this);

//# sourceMappingURL=feeds.js.map
