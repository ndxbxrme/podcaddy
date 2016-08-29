'use strict';
var gzippo = require('gzippo');

module.exports = function(app) {
  app.use('/scripts', gzippo.staticGzip('./dist/scripts'));
  app.use('/images', gzippo.staticGzip('./dist/images'));
  app.use('/styles', gzippo.staticGzip('./dist/styles'));
  app.use('/views', gzippo.staticGzip('./dist/views'));
  app.use('/swf', gzippo.staticGzip('./dist/swf'));
  app.use('/fonts', gzippo.staticGzip('./dist/fonts'));
  app.use('/favicon', gzippo.staticGzip('./dist/favicon'));
  app.all('/*', function(req, res) {
    res.sendFile('index.html', {root: './dist'});
  });   
};