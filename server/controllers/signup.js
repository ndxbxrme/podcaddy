'use strict';

var express = require('express'),
    jwt = require('jsonwebtoken'),
    db = require('../models'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.post('/signup', function(req, res) {
  db.User.find({where: {username: req.body.username}})
  .success(function(user){
    if(user) {
      res.status(401).json({success:false, message:'username taken'});
    }
    else {
      db.User.create({username: req.body.username, password: req.body.password})
      .success(function(user){
        var token = jwt.sign(user, process.env.JWT_SECRET, {expiresInMinutes:60*5});
        res.json({token:token});
      });      
    }
  })
  .error(function(err){
    res.status(401).send(err);
  });
});