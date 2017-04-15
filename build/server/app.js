(function() {
  'use strict';
  var ndx;

  ndx = require('ndx-server').config({
    database: 'pc',
    tables: ['u', 'f', 's', 'i', 'l'],
    userTable: 'u',
    host: 'www.podcaddy.co.uk'
  }).use('ndx-passport').use('ndx-passport-twitter').use('ndx-passport-facebook').use('ndx-user-roles').use('ndx-socket').use('ndx-keep-awake').use('ndx-auth').use('ndx-superadmin').use('ndx-static-routes').use('ndx-connect').use('ndx-memory-check').use('ndx-database-backup').controller(require('./controllers/feeds.js')).start();

}).call(this);

//# sourceMappingURL=app.js.map
