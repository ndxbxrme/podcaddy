'use strict';

var express = require('express'),
    db = require('../models'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};

router.post('/api/position', function(req,res){
  db.User.find(req.user.id)
  .success(function(user){
    user.updateAttributes({position:req.body.position});
    db.Item.find(req.body.itemid)
    .success(function(item){
      user.setCurrent(item);
      if(req.body.history) {
        user.hasHistory(item)
        .success(function(result){
          if(!result) {
            user.addHistory(item); 
          }
        });
      
      }
    });
    res.send('nice!');
  });
});