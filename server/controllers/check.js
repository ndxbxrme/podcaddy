'use strict';

var express = require('express'),
    db = require('../models'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.post('/check/username', function(req, res) {
  db.User.find({where: {username: req.body.field}})
  .success(function(user){
    if(user){
      res.json({isUnique:false});
    } else {
      res.json({isUnique:true});
    }
  });
});