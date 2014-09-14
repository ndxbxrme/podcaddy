'use strict';

var express = require('express'),
    request = require('request'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.post('/api/addfeed', function(req, res) {
  var options = {
    url: req.body.url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.103 Safari/537.36'
    }
  };
  request(options, function(err, response, body){
    res.send(body);
  });
});