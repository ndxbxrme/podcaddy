'use strict';
var express = require('express'),
    compression = require('compression'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    podCtrl = require('./controllers/pod.js'),
    urls = require('./config/urls.js');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(compression())
.use(morgan('dev'))
.use(cookieParser())
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended:true}))
.use(session({secret:process.env.SESSION_SECRET, saveUninitialized:true, resave:true}))
.use(passport.initialize())
.use(passport.session())
.use(flash());

mongoose.connect(process.env.MONGOHQ_URL);

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
/*podCtrl.checkFeed('http://feeds.serialpodcast.org/serialpodcast', function(pod) {
  console.dir(pod);
});*/