var LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GithubStrategy = require('passport-github').Strategy,
    User = require('../models/user'),
    configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  //LOCAL
  
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({'local.email': email}, function(err, user){
        if(err) {
          return done(err); 
        }
        if(user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.')); 
        }
        else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err){
            if(err) {
              throw err; 
            }
            return done(null, newUser);
          });
        }
      });
    }); 
  }));
  
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    User.findOne({'local.email':email}, function(err, user){
      if(err) {
        return done(err); 
      }
      if(!user) {
        return done(null, false, req.flash('loginMessage', 'No user found')); 
      }
      if(!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong password')); 
      }
      return done(null, user);
    });
  }));
  
  //TWITTER
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    passReqToCallback: true
  }, function(req, token, tokenSecret, profile, done){
    process.nextTick(function(){
      if(!req.user) {
        User.findOne({ 'twitter.id': profile.id}, function(err, user) {
          if(err) {
            return done(err);
          }
          if(user) {
            if(!user.twitter.token) {
              user.twitter.token = token;
              user.twitter.username = profile.username;
              user.twitter.displayName = profile.displayName;
              user.save(function(err) {
                if(err) {
                  throw err; 
                }
                return done(null, user);
              });
            }
            return done(null, user); 
          }
          else {
            var newUser = new User();
            newUser.twitter.id = profile.id;
            newUser.twitter.token = token;
            newUser.twitter.username = profile.username;
            newUser.twitter.displayName = profile.displayName;
            newUser.save(function(err){
              if(err) {
                throw err; 
              }
              return done(null, newUser);
            });
          }
        });
      }
      else {
        var user = req.user;
        user.twitter.id = profile.id;
        user.twitter.token = token;
        user.twitter.username = profile.username;
        user.twitter.displayName = profile.displayName;
        user.save(function(err) {
          if(err) {
            throw err; 
          }
          return done(null, user);
        });
      }
    });
  }));
  
  //FACEBOOK
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done){
    process.nextTick(function(){
      if(!req.user) {
        User.findOne({'facebook.id': profile.id}, function(err, user){
          if(err) {
            return done(err); 
          }
          if(user) {
            if(!user.facebook.token) {
              user.facebook.token = token;
              user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              user.facebook.email = profile.emails[0].value;
              user.save(function(err) {
                if(err) {
                  throw err; 
                }
                return done(null, user);
              });
            }
            return done(null, user); 
          }
          else {
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;
            newUser.save(function(err){
              if(err) {
                throw err; 
              }
              return done(null, newUser);
            });
          }
        });
      }
      else {
        var user = req.user;
        user.facebook.id = profile.id;
        user.facebook.token = token;
        user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;
        user.save(function(err){
          if(err) {
            throw err; 
          }
          return done(null, user);
        });
      }
    });
  }));
  
  //GITHUB
  passport.use(new GithubStrategy({
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL,
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function(){
      if(!req.user) {
        User.findOne({'github.id':profile.id}, function(err, user){
          if(err) {
            return done(err); 
          }
          if(user) {
            if(!user.github.token) {
              user.github.token = token;
              user.github.name = profile.displayName;
              user.github.email = profile.emails[0].value;
              user.save(function(err) {
                if(err) {
                  throw err; 
                }
                return done(null, user);
              });
            }
            return done(null, user); 
          }
          else {
            var newUser = new User();
            newUser.github.id = profile.id;
            newUser.github.token = token;
            newUser.github.name = profile.displayName;
            newUser.github.email = profile.emails[0].value;
            newUser.save(function(err){
              if(err) {
                throw err; 
              }
              return done(null, newUser);
            });
          }
        }); 
      }
      else {
        var user = req.user;
        user.github.id = profile.id;
        user.github.token = token;
        user.github.name = profile.displayName;
        user.github.email = profile.emails[0].value;
        user.save(function(err){
          if(err) {
            throw err; 
          }
          return done(null, err);
        });
      }
    }); 
  }));
  
  
};