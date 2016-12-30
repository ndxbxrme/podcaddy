(function() {
  'use strict';
  var AWS;

  AWS = require('aws-sdk');

  module.exports = function(dbname) {
    var S3;
    AWS.config.bucket = process.env.AWS_BUCKET;
    AWS.config.region = process.env.AWS_REGION || 'us-east-1';
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    S3 = new AWS.S3();
    return {
      dbs: function(cb) {
        return S3.listBuckets({}, function(e, r) {
          return typeof cb === "function" ? cb(e, r) : void 0;
        });
      },
      keys: function(from, prefix, cb) {
        var m;
        m = {
          Bucket: AWS.config.bucket,
          Prefix: prefix
        };
        console.log('m', m);
        if (from) {
          m.Marker = from;
        }
        return S3.listObjects(m, function(e, r) {
          return typeof cb === "function" ? cb(e, r) : void 0;
        });
      },
      del: function(key, cb) {
        var m;
        m = {
          Bucket: AWS.config.bucket,
          Key: key
        };
        return S3.deleteObject(m, function(e, r) {
          return typeof cb === "function" ? cb(e, r) : void 0;
        });
      },
      put: function(key, o, cb) {
        var m;
        m = {
          Bucket: AWS.config.bucket,
          Key: key,
          Body: JSON.stringify(o),
          ContentType: 'application/json'
        };
        return S3.putObject(m, function(e, r) {
          if (e) {
            console.log('put error', key);
          } else {
            console.log('put success', key);
          }
          return typeof cb === "function" ? cb(e, r) : void 0;
        });
      },
      get: function(key, cb) {
        var m;
        m = {
          Bucket: AWS.config.bucket,
          Key: key
        };
        return S3.getObject(m, function(e, r) {
          var d;
          if (e || !r.Body) {
            return typeof cb === "function" ? cb(e || 'error', null) : void 0;
          }
          console.log('got', key);
          d = JSON.parse(r.Body);
          return typeof cb === "function" ? cb(null, d) : void 0;
        });
      }
    };
  };

}).call(this);

//# sourceMappingURL=s3.js.map
