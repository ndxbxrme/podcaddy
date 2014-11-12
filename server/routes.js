'use strict';

var podCtrl = require('./controllers/pod'),
    itemCtrl = require('./controllers/item'),
    playlistCtrl = require('./controllers/playlist.js');

module.exports = function(app, passport) {
  app.get('/api/user', isLoggedIn, function(req, res) {
    res.json(req.user);
  });
  
  
  app.get('/api/pods/all', podCtrl.fetchAll);
  
  app.post('/api/pods/all', podCtrl.fetchAll);
  
  app.post('/api/pods/subs', isLoggedIn, podCtrl.fetchSubs);
  
  app.post('/api/pods/add', isLoggedIn, podCtrl.addPod);
  
  app.get('/api/subscribed/:feed/:playlist/:period/:visited/:direction', isLoggedIn, itemCtrl.fetchSubs);
  
  app.post('/api/skip', isLoggedIn, itemCtrl.skipItem);
  
  app.post('/api/position', isLoggedIn, itemCtrl.reportPosition);
  
  app.post('/api/subs/toggle', isLoggedIn, podCtrl.toggle);
  
  app.post('/api/playlist/toggle', isLoggedIn, playlistCtrl.toggle);
  
  app.post('/api/playlist/create', isLoggedIn, playlistCtrl.create);
  
  app.post('/api/playlist/addpod', isLoggedIn, playlistCtrl.addPod);
  
  app.post('/api/playlist/removePod', isLoggedIn, playlistCtrl.removePod);
  
  
  
  
  //LOGIN AUTHENTICATE/FIRST SIGNUP
  
  app.post('/api/signup', passport.authenticate('local-signup', {
    successRedirect: '/api/user',
    failureRedirect: '/api/user',
    failureFlash: true
  }));
  
  app.post('/api/login', passport.authenticate('local-login', {
    successRedirect: '/api/user',
    failureRedirect: '/api/user',
    failureFlash: true
  }));
 
  app.get('/api/twitter', passport.authenticate('twitter', {scope:'email'}));
  
  app.get('/api/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
  
  app.get('/api/facebook', passport.authenticate('facebook', {scope:'email'}));
  
  app.get('/api/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
  
  app.get('/api/github', passport.authenticate('github', {scope:['user','user:email']}));
  
  app.get('/api/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
  
  //LOGIN CONNECT ACCOUNTS
  app.get('/api/connect/local', function(req, res) {
    //send flash message
  });
  app.post('/api/connect/local', passport.authorize('local-signup', {
    successRedirect: '/api/user',
    failureRedirect: '/api/user',
    failureFlash: true
  }));
  
  app.get('/api/connect/twitter', passport.authorize('twitter', {scope:'email'}));
  app.get('/api/connect/facebook', passport.authorize('facebook', {scope:'email'}));
  app.get('/api/connect/github', passport.authorize('github', {scope:['user','user:email']}));
  
  //UNLINK ACCOUNTS
  app.get('/api/unlink/local', function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err){
      res.redirect('api/user');
    });
  });
  
  app.get('/api/unlink/twitter', function(req, res) {
    var user = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });
   app.get('/api/unlink/facebook', function(req, res) {
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });
  app.get('/api/unlink/github', function(req, res) {
    var user = req.user;
    user.github.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });
  
  app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/api/user');
  });
  
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next(); 
    }
    res.status(401).send(req.flash('loginMessage'));
  }
};