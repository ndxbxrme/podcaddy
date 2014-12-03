'use strict';
var express = require('express'),
    compression = require('compression'),
    mongoose = require('mongoose');

mongoose.connect(process.env.MONGOHQ_URL);

var passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    podCtrl = require('./controllers/pod.js'),
    urls = require('./config/urls.js');
var app = express();
var mongoStore = new MongoStore({
      mongoose_connection: mongoose.connection,
      auto_reconnect: true
});
app.set('port', 23232);
app.use(compression())
.use(morgan('dev'))
.use(cookieParser())
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended:true}))
.use(session(
  {
    secret:process.env.SESSION_SECRET, 
    saveUninitialized:true, 
    resave:true,
    store: mongoStore
  }
))
.use(passport.initialize())
.use(passport.session())
.use(flash());


require('./config/passport')(passport);

require('./routes.js')(app, passport);

require('./angular.js')(app);

app.listen(app.get('port'));
console.log('api server listening on ' + app.get('port'));
/*var count = 32;
setInterval(function() {
  console.log(count + '/' + urls.length);
  podCtrl.checkFeed(urls[count++], function(pod) {
    console.log(pod.url);
  });
}, 12000);
*/
/*podCtrl.checkFeed('http://cashinginwithtjmiller.libsyn.com/rss', function(pod) {
  console.dir(pod);
});*/