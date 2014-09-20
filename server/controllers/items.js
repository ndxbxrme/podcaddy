'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models');

module.exports = function(app){
  app.use('/', router);
};

router.get('/api/subscribed', function(req, res) {
  var now = new Date();
  now.setDate(now.getDate() - 7);
  db.Item.findAll({
    where:{pubDate: {gt:now}}, 
    order:'"pubDate" DESC',
    include:[{
      attributes:['id','data','url'],
      model:db.Feed, 
      include:[{
        model:db.User, 
        attributes:['data'],
        as:'Subscribed',
        where:{id:req.user.id}
      }]
    }]
  })
  .success(function(items){
    res.json(items);
  });
});