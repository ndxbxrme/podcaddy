podcaddy
========
a podcast playing website and server. 

under development so don't expect it to work `just yet`

##installation

```
git clone https://github.com/ndxbxrme/podcaddy
cd podcaddy
npm install
bower install
```

make a new postgres database called podcaddy-development.

clone server/config/local.env.js.sample, remove .sample from the file name, fill in your database details and make up a secret key.

```
grunt serve
```
