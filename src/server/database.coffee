dbname = 'pc'
alasql = require 'alasql'
fs = require 'fs'
filename = './tmp/podcaddy.json'
s3 = require('./s3')(dbname)
async = require 'async'

module.exports = ->
  database = null
  maintenanceMode = false
  attachDatabase: ->
    console.log 'meee'
    maintenanceMode = true
    alasql 'CREATE DATABASE podcaddy'
    alasql 'USE podcaddy'
    alasql 'CREATE TABLE u'
    alasql 'CREATE TABLE f'
    alasql 'CREATE TABLE s'
    alasql 'CREATE TABLE i'
    alasql 'CREATE TABLE l'
    database = alasql.databases.podcaddy
    deleteKeys = (cb) ->
      s3.keys null, dbname + ':node:', (e, r) ->
        if not e and r and r.Contents
          for key in r.Contents
            s3.del key.Key
        if r.IsTruncated
          deleteKeys cb
        else
          cb()
    inflate = (from, cb) ->
      s3.keys from, dbname + ':node:', (e, r) ->
        if e or not r.Contents
          return console.log 'error', e
        async.eachSeries r.Contents, (key, callback) ->
          key.Key.replace /(.+):(.+):(.+)\/(.+)/, (all, db, type, table, id) ->
            if db and table and id and db is dbname
              if table.length is 1
                s3.get key.Key, (e, o) ->
                  if e
                    return callback()
                  idField = if table is 'u' then '_id' else 'i'
                  database.exec 'DELETE FROM ' + table + ' WHERE ' + idField + '=?', [o[idField]]
                  database.exec 'INSERT INTO ' + table + ' VALUES ?', [o]
                  return callback()
              else
                return callback()
            else
              callback()
        , ->
          if r.IsTruncated
            inflate r.Contents[r.Contents.length-1].Key, cb
          else
            cb()
    s3.get dbname + ':database', (e, o) ->
      database.tables.u.data = o.u.data
      database.tables.f.data = o.f.data
      database.tables.s.data = o.s.data
      database.tables.i.data = o.i.data
      database.tables.l.data = o.l.data
      inflate null, ->
        deleteKeys ->
          s3.put dbname + ':database', database.tables, (e) ->
            if not e
              console.log 'database updated and uploaded'
              maintenanceMode = false
    setInterval ->
      maintenanceMode = true
      s3.put dbname + ':database', database.tables, (e) ->
        if not e
          console.log 'database uploaded'
          deleteKeys ->
            maintenanceMode = false
        else
          maintenanceMode = false
    , 11 * 60 * 60 * 1000
  exec: (sql, props, notCritical) ->
    if maintenanceMode
      return []
    data = database.exec sql, props
    if notCritical
      return data
    #return data
    if sql.indexOf('UPDATE') isnt -1
      sql.replace /UPDATE (.+) SET (.+) WHERE (.+)/, (all, table, set, where) ->
        #get number of question marks in SET, remove that number of props from the beginning of the list
        noSetFields = (set.match(/\?/g) or []).length
        props.splice noSetFields
        res = database.exec 'SELECT * FROM ' + table + ' WHERE ' + where, props
        if res and res.length
          async.eachSeries res, (r, callback) ->
            s3.put dbname + ':node:' + table + '/' + (r.i or r._id or r.id), r
            callback()
        #select with remaining props
        #foreach result, upload to s3
    else if sql.indexOf('INSERT') isnt -1
      sql.replace /INSERT INTO (.+) (SELECT|VALUES)/, (all, table) ->
        if Object.prototype.toString.call(props[0]) is '[object Array]'
          for prop in props[0]
            s3.put dbname + ':node:' + table + '/' + (prop.i or prop._id or prop.id), prop
        else
          s3.put dbname + ':node:' + table + '/' + (props[0].i or props[0]._id or props[0].id), prop
    return data
    #if it's an update or insert then persist to s3
  maintenanceOn: ->
    maintenanceMode = true
  maintenanceOff: ->
    maintenanceMode = false
  maintenance: ->
    maintenanceMode
  getDb: ->
    database
  uploadDatabase: (cb) ->
    s3.put dbname + ':database', database.tables, (e) ->
      if not e
        console.log 'database uploaded'
      cb?()