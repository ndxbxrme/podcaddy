(function() {
  var alasql, async, dbname, filename, fs, s3;

  dbname = 'pc';

  alasql = require('alasql');

  fs = require('fs');

  filename = './tmp/podcaddy.json';

  s3 = require('./s3')(dbname);

  async = require('async');

  module.exports = function() {
    var database, maintenanceMode;
    database = null;
    maintenanceMode = false;
    return {
      attachDatabase: function() {
        var deleteKeys, inflate;
        console.log('meee');
        maintenanceMode = true;
        alasql('CREATE DATABASE podcaddy');
        alasql('USE podcaddy');
        alasql('CREATE TABLE u');
        alasql('CREATE TABLE f');
        alasql('CREATE TABLE s');
        alasql('CREATE TABLE i');
        alasql('CREATE TABLE l');
        database = alasql.databases.podcaddy;
        deleteKeys = function(cb) {
          return s3.keys(null, dbname + ':node:', function(e, r) {
            var i, key, len, ref;
            if (!e && r && r.Contents) {
              ref = r.Contents;
              for (i = 0, len = ref.length; i < len; i++) {
                key = ref[i];
                s3.del(key.Key);
              }
            }
            if (r.IsTruncated) {
              return deleteKeys(cb);
            } else {
              return cb();
            }
          });
        };
        inflate = function(from, cb) {
          return s3.keys(from, dbname + ':node:', function(e, r) {
            if (e || !r.Contents) {
              return console.log('error', e);
            }
            return async.eachSeries(r.Contents, function(key, callback) {
              return key.Key.replace(/(.+):(.+):(.+)\/(.+)/, function(all, db, type, table, id) {
                if (db && table && id && db === dbname) {
                  if (table.length === 1) {
                    return s3.get(key.Key, function(e, o) {
                      var idField;
                      if (e) {
                        return callback();
                      }
                      idField = table === 'u' ? '_id' : 'i';
                      database.exec('DELETE FROM ' + table + ' WHERE ' + idField + '=?', [o[idField]]);
                      database.exec('INSERT INTO ' + table + ' VALUES ?', [o]);
                      return callback();
                    });
                  } else {
                    return callback();
                  }
                } else {
                  return callback();
                }
              });
            }, function() {
              if (r.IsTruncated) {
                return inflate(r.Contents[r.Contents.length - 1].Key, cb);
              } else {
                return cb();
              }
            });
          });
        };
        s3.get(dbname + ':database', function(e, o) {
          database.tables.u.data = o.u.data;
          database.tables.f.data = o.f.data;
          database.tables.s.data = o.s.data;
          database.tables.i.data = o.i.data;
          database.tables.l.data = o.l.data;
          return inflate(null, function() {
            return deleteKeys(function() {
              return s3.put(dbname + ':database', database.tables, function(e) {
                if (!e) {
                  console.log('database updated and uploaded');
                  return maintenanceMode = false;
                }
              });
            });
          });
        });
        return setInterval(function() {
          maintenanceMode = true;
          return s3.put(dbname + ':database', database.tables, function(e) {
            if (!e) {
              console.log('database uploaded');
              return deleteKeys(function() {
                return maintenanceMode = false;
              });
            } else {
              return maintenanceMode = false;
            }
          });
        }, 11 * 60 * 60 * 1000);
      },
      exec: function(sql, props, notCritical) {
        var data;
        if (maintenanceMode) {
          return [];
        }
        data = database.exec(sql, props);
        if (notCritical) {
          return data;
        }
        if (sql.indexOf('UPDATE') !== -1) {
          sql.replace(/UPDATE (.+) SET (.+) WHERE (.+)/, function(all, table, set, where) {
            var noSetFields, res;
            noSetFields = (set.match(/\?/g) || []).length;
            props.splice(noSetFields);
            res = database.exec('SELECT * FROM ' + table + ' WHERE ' + where, props);
            if (res && res.length) {
              return async.eachSeries(res, function(r, callback) {
                s3.put(dbname + ':node:' + table + '/' + (r.i || r._id || r.id), r);
                return callback();
              });
            }
          });
        } else if (sql.indexOf('INSERT') !== -1) {
          sql.replace(/INSERT INTO (.+) (SELECT|VALUES)/, function(all, table) {
            var i, len, prop, ref, results;
            if (Object.prototype.toString.call(props[0]) === '[object Array]') {
              ref = props[0];
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                prop = ref[i];
                results.push(s3.put(dbname + ':node:' + table + '/' + (prop.i || prop._id || prop.id), prop));
              }
              return results;
            } else {
              return s3.put(dbname + ':node:' + table + '/' + (props[0].i || props[0]._id || props[0].id), prop);
            }
          });
        }
        return data;
      },
      maintenanceOn: function() {
        return maintenanceMode = true;
      },
      maintenanceOff: function() {
        return maintenanceMode = false;
      },
      maintenance: function() {
        return maintenanceMode;
      },
      getDb: function() {
        return database;
      },
      uploadDatabase: function(cb) {
        return s3.put(dbname + ':database', database.tables, function(e) {
          if (!e) {
            console.log('database uploaded');
          }
          return typeof cb === "function" ? cb() : void 0;
        });
      }
    };
  };

}).call(this);

//# sourceMappingURL=database.js.map
