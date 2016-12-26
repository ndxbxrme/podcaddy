'use strict'

LocalStrategy = require('passport-local').Strategy
TwitterStrategy = require('passport-twitter').Strategy
ObjectID = require 'bson-objectid'
bcrypt = require 'bcrypt-nodejs'

module.exports = (passport, database) ->
  generateHash = (password) ->
    bcrypt.hashSync password, bcrypt.genSaltSync(8), null
  validPassword = (password, localPassword) ->
    bcrypt.compareSync password, localPassword
  passport.serializeUser (user, done) ->
    done null, user._id
  passport.deserializeUser (id, done) ->
    done null, id
  passport.use 'local-signup', new LocalStrategy
    usernameField: 'email'
    passwordField: 'password'
    passReqToCallback: true
  , (req, email, password, done) ->
    users = database.exec 'SELECT * FROM u WHERE local->email=?', [email]
    if users and users.length
      return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
    else
      newUser = 
        _id: ObjectID.generate()
        local:
          email: email
          password: generateHash password
      database.exec 'INSERT INTO u VALUES ?', [newUser]
      done null, newUser
  passport.use 'local-login', new LocalStrategy
    usernameField: 'email'
    passwordField: 'password'
    passReqToCallback: true
  , (req, email, password, done) ->
    users = database.exec 'SELECT * FROM u WHERE local->email=?', [email]
    if users and users.length
      if not validPassword password, users[0].local.password
        return done(null, false, req.flash('loginMessage', 'Wrong password'))
      return done(null, users[0])
    else
      return done(null, false, req.flash('loginMessage', 'No user found'))
  console.log process.env.TWITTER_KEY
  passport.use new TwitterStrategy
    consumerKey: process.env.TWITTER_KEY
    consumerSecret: process.env.TWITTER_SECRET
    callbackURL: process.env.TWITTER_CALLBACK
    passReqToCallback: true
  , (req, token, tokenSecret, profile, done) ->
    process.nextTick ->
      if not req.user
        users = database.exec 'SELECT * FROM u WHERE twitter->id=?', [profile.id]
        if users and users.length
          if not users[0].twitter.token
            database.exec 'UPDATE u SET twitter=? WHERE _id=?', [
              {
                id: profile.id
                token: token
                username: profile.username
                displayName: profile.displayName
              },
              users[0]._id
            ]
            return done null, users[0]
          return done null, users[0]
        else
          newUser =
            _id: ObjectID.generate()
            twitter:
              id: profile.id
              token: token
              username: profile.username
              displayName: profile.displayName
          database.exec 'INSERT INTO u VALUES ?', [newUser]
          return done null, newUser
      else
        database.exec 'UPDATE u SET twitter=? WHERE _id=?', [
          {
            id: profile.id
            token: token
            username: profile.username
            displayName: profile.displayName
          },
          req.user._id
        ]
        return done null, req.user
        
  passport.use new FacebookStrategy
    clientID: process.env.FACEBOOK_KEY
    clientSecret: process.env.FACEBOOK_SECRET
    callbackURL: process.env.FACEBOOK_CALLBACK
    passReqToCallback: true
  , (req, token, refreshToken, profile, done) ->
    if not req user
      users = database.exec 'SELECT * FROM u WHERE facebook->id=?', [profile.id]
      if users and users.length
        if not users[0].facebook.token
          database.exec 'UPDATE u SET facebook=? WHERE _id=?', [
            {
              token: token
              name: profile.name.givenName + ' ' + profile.name.familyName
              email: profile.emails[0].value
            },
            req.user._id
          ]
          return done null, users[0]
        return done null, users[0]
      else
        newUser = 
          _id: ObjectID.generate()
          facebook:
            id: profile.id
            token: token
            name: profile.name.givenName + ' ' + profile.name.familyName
            email: profile.emails[0].value
        database.exec 'INSERT INTO u VALUES ?', [newUser]
        return done null, newUser
    else
      database.exec 'UPDATE u SET facebook=? WHERE _id=?', [
        {
          id: profile.id
          token: token
          name: profile.name.givenName + ' ' + profile.name.familyName
          email: profile.emails[0].value
        },
        req.user._id
      ]
      return done null, req.user
                
  passport.use new GithubStrategy
    clientID: process.env.GITHUB_KEY
    clientSecret: process.env.GITHUB_SECRET
    callbackURL: process.env.GITHUB_CALLBACK
    passReqToCallback: true
  , (req, token, refreshToken, profile, done) ->
    if not req user
      users = database.exec 'SELECT * FROM u WHERE github->id=?', [profile.id]
      if users and users.length
        if not users[0].github.token
          database.exec 'UPDATE u SET github=? WHERE _id=?', [
            {
              token: token
              name: profile.displayName
              email: profile.emails[0].value
            },
            req.user._id
          ]
          return done null, users[0]
        return done null, users[0]
      else
        newUser = 
          _id: ObjectID.generate()
          github:
            id: profile.id
            token: token
            name: profile.displayName
            email: profile.emails[0].value
        database.exec 'INSERT INTO u VALUES ?', [newUser]
        return done null, newUser
    else
      database.exec 'UPDATE u SET github=? WHERE _id=?', [
        {
          id: profile.id
          token: token
          name: profile.displayName
          email: profile.emails[0].value
        },
        req.user._id
      ]
      return done null, req.user
    