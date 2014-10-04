var express = require('express');
var glob = require('glob');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var path = require('path');
var expressJwt = require('express-jwt'),
    gzippo = require('gzippo');


module.exports = function(app, config){
  app.set('port', process.env.PORT || 3000);
  app.use('/api', expressJwt({secret:process.env.JWT_SECRET}));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compress());
  app.use(methodOverride());
  
  var controllers = glob.sync(path.normalize(__dirname + '/..') + '/controllers/*.js');
  controllers.forEach(function(controller){
    require(controller)(app);
  });

app.use('/scripts', gzippo.staticGzip(__dirname + '/../../dist/scripts'));
app.use('/images', gzippo.staticGzip(__dirname + '/../../dist/images'));
app.use('/styles', gzippo.staticGzip(__dirname + '/../../dist/styles'));
app.use('/views', gzippo.staticGzip(__dirname + '/../../dist/views'));
app.use('/swf', gzippo.staticGzip(__dirname + '/../../dist/swf'));
app.all('/*', function(req, res) {
  res.sendFile('index.html', {root: __dirname + '/../../dist'});
});  
  
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });
};