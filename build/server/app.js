(function() {
  'use strict';
  var ndx;

  ndx = require('ndx-server').config({
    database: 'pc',
    tables: ['u', 'f', 's', 'i', 'l'],
    userTable: 'u'
  }).controller(require('./controllers/feeds.js')).start();

}).call(this);

//# sourceMappingURL=app.js.map
