podcaddy
========
a podcast playing website and aggregating server. 

under development so don't expect it to work `just yet`

##installation

```
git clone https://github.com/ndxbxrme/podcaddy
cd podcaddy
npm install
bower install
```

make a new postgres database called podcaddy-development.

clone `server/config/local.env.js.sample`, remove `.sample` from the file name, fill in your database details and make up a secret key.

```
grunt serve
```


###deploy to heroku
```
heroku login
heroku create
heroku addons:add heroku-postgresql:dev
heroku pg:promote HEROKU_POSTGRESQL_PINK //find colour by looking at heroku config
heroku config:set JWT_SECRET=secret
heroku config:set BETA_KEY=mybetakey
grunt build
git add --all
git commit -m "heroku"
git push heroku master
heroku ps:scale web=1
heroku open
```