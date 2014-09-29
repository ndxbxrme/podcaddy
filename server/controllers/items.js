'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    Sequelize = require('sequelize');

module.exports = function(app){
  app.use('/', router);
};

router.post('/api/skip', function(req,res){
  db.User.find(req.user.id)
  .success(function(user){
    db.Item.find(req.body.id)
    .success(function(item){
      user.hasSkipped(item)
      .success(function(result){
        if(!result){
          user.addSkipped(item); 
          res.json({msg:'skipped'});
        }
      });
    });
  });
});

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
  var order = '"pubDate" DESC';
  if(req.params.direction==='asc') {
    order = '"pubDate" ASC'; 
  }
  var subRequired = true;
  var feedWhere = {};
  if(req.params.feed!=='all') {
    subRequired = false;
    feedWhere = {id:req.params.feed}; 
  }
  var where = {pubDate: {gt:now}};
  if(req.params.visited==='visited') {
    where = Sequelize.and(where, Sequelize.or({
      "History.id":{gt:0}},
      Sequelize.or({
        "Skipped.id":{gt:0}
      })))
  }
  else if(req.params.visited==='unvisited') {
    where['"History.id"'] = null; 
    where['"Skipped.id"'] = null; 
  }
  db.Item.findAll({
    where:where, 
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
      attributes:['id'],
      as:'History',
      where:{id:req.user.id},
      required: false
    },{
      model:db.User,
      attributes:['id'],
      as:'Skipped',
      where:{id:req.user.id},
      required: false
    }]
  })
  .success(function(items){
    res.json(items);
  });
});