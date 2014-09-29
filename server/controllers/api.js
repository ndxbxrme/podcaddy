'use strict';

var express = require('express'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.post('/api', function(req, res) {
  res.send('welcome to api m\'dear' + JSON.stringify(req.user.id));
});