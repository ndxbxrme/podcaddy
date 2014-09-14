'use strict';

var express = require('express'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.get('/toot/:myvar', function(req, res) {
  res.send('flart' + req.params.myvar);
});