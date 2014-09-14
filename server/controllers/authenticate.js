'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    jwt = require('jsonwebtoken');

module.exports = function(app){
  app.use('/', router);
};

router.post('/authenticate', function(req, res) {
  db.User.find({where: {username: req.body.username, password: req.body.password}})
  .success(function(user){
    if(user) {
      var token = jwt.sign(user, process.env.JWT_SECRET, {expiresInMinutes:60*5});
      res.json({token:token});   
    }
    else {
      res.status(401).json({success:false, message:'user not found'}); 
    }
  })
  .error(function(err){
    res.status(401).send(err);
  });

});