'use strict';

var express = require('express');

var app = express();

app.get('/api', function(req, res){
    console.log('i got served' + process.env.SECRET);
    res.send('yoyoyo');
});
console.log('hey');
app.listen(3000);