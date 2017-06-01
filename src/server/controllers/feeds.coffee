'use strict'

ObjectID = require 'bson-objectid'

module.exports = (ndx) ->
  feedsService = require('../services/feeds.js') ndx.database, ndx.socket
  doPoll = ->
    feedsService.pollFeeds ->
      console.log 'POLL CALLBACK'
      setTimeout doPoll, 60 * 1000
  doPoll()
  ndx.app.post '/api/pods', (req, res) ->
    data = []
    props = []
    where = ''
    subsJoin = ''
    if req.body.feedSlug
      props.push new Date('2001/01/01').valueOf()
      props.push new Date().valueOf()
      props.push req.body.feedSlug
      where = ' AND f.s=? '
    else
      if req.user
        props.push new Date().setHours(new Date().getHours() - (24 * 7)).valueOf()
        props.push new Date().valueOf()
        props.push req.user._id
        where = ' AND s.u=? '
        subsJoin = ' LEFT JOIN s ON i.f=s.f '
      else
        props.push new Date().setHours(new Date().getHours() - 24).valueOf()
        props.push new Date().valueOf()
        where = ''

    if not req.user
      data = ndx.database.exec 'SELECT i.t as title, i.d as description, i.u as url, i.l as length, i.p as pubDate, i.s as slug, f.t AS feedTitle, f.iu as imageUrl, f.s as feedSlug, f.c as categories FROM i LEFT JOIN f on i.f=f.i WHERE i.p > ? AND i.p < ? ' + where + ' ORDER BY i.p DESC', props
    else
      data = ndx.database.exec 'SELECT i.i as _id, i.t as title, i.d as description, i.u as url, i.l as length, i.p as pubDate, i.s as slug, f.t AS feedTitle, f.iu as imageUrl, f.s as feedSlug, f.c as categories, l.d as listened FROM i LEFT JOIN f on i.f=f.i ' + subsJoin + ' LEFT JOIN l ON l.p=i.i WHERE i.p > ? AND i.p < ? ' + where + ' ORDER BY i.p DESC', props
    res.json data

  ndx.app.post '/api/feeds', (req, res) ->
    props = []
    if req.user
      props.push req.user._id
    else
      props.push 'nobody'
    data = ndx.database.exec 'SELECT f.i AS feedId, f.t AS feedTitle, f.d AS feedDescription, f.iu as imageUrl, f.s as feedSlug, f.c as categories, s.d as subscribed FROM f LEFT JOIN s ON s.f=f.i AND s.u=? ORDER BY f.t ASC', props
    res.json data

  ndx.app.post '/api/report-listen', (req, res) ->
    if req.user and req.body.podId
      prevListen = ndx.database.exec 'SELECT * FROM l WHERE p=? AND u=?', [req.body.podId, req.user._id]
      if prevListen and prevListen.length
        #do nothing
      else
        ndx.database.exec 'INSERT INTO l VALUES ?', [{
          i: ObjectID.generate()
          p: req.body.podId
          u: req.user._id
          d: new Date().valueOf()
        }]
    res.end 'OK'

  ndx.app.post '/api/subscribe', (req, res) ->
    if req.user and req.body.feedId
      feedsService.subscribe req.user._id, req.body.feedId
    res.end 'OK'
  ndx.app.post '/api/unsubscribe', (req, res) ->
    if req.user and req.body.feedId
      ndx.database.exec 'UPDATE s SET f=? WHERE u=? AND f=?', ['.', req.user._id, req.body.feedId]
    res.end 'OK'

  ndx.app.post '/api/add-feed', (req, res) ->
    if req.user._id and req.body.feedUrl
      feedsService.addFeed req.user._id, req.body.feedUrl, (err, feed) ->
        if err
          if feed
            feed.error = err
            res.json feed
          else
            res.json
              error: err
        else
          res.json feed
    else
      res.end 'OK'