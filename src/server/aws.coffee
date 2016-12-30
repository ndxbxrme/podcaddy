'use strict'
dbname = 'pc'
s3 = require('./s3')(dbname)
alasql = require 'alasql'
fs = require 'fs'
ObjectID = require 'bson-objectid'

console.log 'yo'
deleteAll = ->
  s3.keys null, dbname + ':', (e, r) ->
    if e
      return console.log 'error', e
    console.log 'response', r
    if not e and r and r.Contents
      count = 0
      for key in r.Contents
        s3.del key.Key, (e) ->
          console.log ++count + '/' + r.Contents.length, 'delete error?', e
    if r.IsTruncated
      deleteAll()

makeDb = ->
  alasql 'CREATE DATABASE podcaddy'
  alasql 'USE podcaddy'
  alasql 'CREATE TABLE u'
  alasql 'CREATE TABLE f'
  alasql 'CREATE TABLE s'
  alasql 'CREATE TABLE i'
  alasql 'CREATE TABLE l'
  users = JSON.parse fs.readFileSync './data/users.json'
  for user in users
    alasql 'INSERT INTO u VALUES ?', [user]
    ###
    s3.put dbname + ':u/' + user._id, user, (e, r) ->
      if e then return console.log 'error'
      console.log 'user inserted into s3'
    ###
  feedsJson = JSON.parse fs.readFileSync './data/pods_processed.json'
  distinctUrls = alasql 'SELECT DISTINCT(title + description) AS url FROM ?', [feedsJson]
  for url in distinctUrls
    #console.log 'gettin', url
    feed = alasql 'SELECT _id as i, title as t, slug as s, description as d, url as u, link as l, image as im, imageUrl as iu, categories as c, pubDate as p, updated as up FROM ? WHERE (title+description)=?', [feedsJson, url.url]
    if feed and feed.length
      feedExists = alasql 'SELECT * FROM f WHERE t=? AND d=?', [feed.t, feed.d]
      if feedExists and feedExists.length
        console.log 'DUPLICATE:', feed.t
      else
        #console.log 'got feed', feed[0].title
        alasql 'INSERT INTO f VALUES ?', [feed[0]]
        ###
        s3.put dbname + ':f/' + feed[0].i, feed[0], (e, r) ->
          if e then return console.log 'error'
          console.log 'feed inserted into s3'
        ###
        if feed.length > 1
          console.log feed[0].t
  subsJson = JSON.parse fs.readFileSync './data/subs_processed.json'
  subs = alasql 'SELECT pid as f, uid as u, d FROM ?', [subsJson]
  for sub in subs
    sub.i = ObjectID.generate()
    alasql 'INSERT INTO s VALUES ?', [sub]
    ###
    s3.put dbname + ':s/' + sub.i, sub, (e, r) ->
      if e then return console.log 'error'
      console.log 'sub inserted into s3'
    ###
  s3.put dbname + ':database', alasql.databases.podcaddy.tables, (e) ->
    if not e
      console.log 'database uploaded'
  #fs.writeFileSync './data/podcaddy.json', JSON.stringify(alasql.databases.podcaddy.tables), 'utf-8'
  #console.log 'done'

readKeys = ->
  s3.keys null, (e, r) ->
    if e
      return console.log 'error', e
    console.log 'response', r
makeDb()