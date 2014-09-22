'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models');

module.exports = function(app){
  app.use('/', router);
};

router.get('/api/subscribed/:feed/:playlist/:period/:visited/:direction', function(req, res) {
  var now = new Date();
  switch(req.params.period) {
    case 'day':
      now.setDate(now.getDate() - 1);
      break;
    case 'week':
      now.setDate(now.getDate() - 7);
      break;
    case 'month':
      now.setDate(now.getDate() - 31);
      break;
    case 'year':
      now.setDate(now.getDate() - 365);
      break;
    case 'alltime':
      now = new Date(1970,1,1);
      break;
  }
  var subRequired = true;
  var feedWhere = {};
  if(req.params.feed!=='all') {
    subRequired = false;
    feedWhere = {id:req.params.feed}; 
  }
  db.Item.findAll({
    where:{pubDate: {gt:now}}, 
    order:'"pubDate" DESC',
    include:[{
      attributes:['id','data','url'],
      model:db.Feed, 
      where: feedWhere,
      include:[{
        model:db.User, 
        attributes:['data'],
        as:'Subscribed',
        where:{id:req.user.id},
        required: subRequired
      }]
    },{
      model:db.User, 
      attributes:['data'],
      as:'History',
      where:{id:req.user.id},
      required: false
    }]
  })
  .success(function(items){
    res.json(items);
  });
});