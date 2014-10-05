'use strict';

var express = require('express'),
    jwt = require('jsonwebtoken'),
    db = require('../models'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.post('/signup', function(req, res) {
  if(req.body.betakey===process.env.BETA_KEY) {
    db.User.find({where: {username: req.body.username}})
    .success(function(user){
      if(user) {
        res.status(401).json({error:true, message:'This username has been taken'});
      }
      else {
        db.User.create({username: req.body.username, password: req.body.password, data:{}})
        .success(function(user){
          var token = jwt.sign(user, process.env.JWT_SECRET, {expiresInMinutes:60*5});
          res.json({error:false,token:token});
        });      
      }
    })
    .error(function(err){
      res.status(401).send(err);
    });
  } else {
    res.json({error:true,message:'Invalid Beta Key'}); 
  }
});