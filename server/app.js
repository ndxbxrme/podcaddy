'use strict';

var express = require('express'),
    db = require('./models'),
    http = require('http');

var app = express();

require('./config/express')(app);

db
.sequelize
.sync({force:true})
.complete(function(err){
  if(err){
    throw err[0]; 
  } else {
    http.createServer(app).listen(app.get('port'), function(){
      console.log('API Server listening on port ' + app.get('port'));
    });
  }
});
