'use strict';

var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
  url: String,
  title: String,
  description: String,
  shortDesc: String,
  image: String,
  cloudinary: mongoose.Schema.Types.Mixed,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  pubDate: Date,
  skipped: [ { userId: String, date: {type: Date, default: Date.now }}],
  listened: [ { userId: String, date: {type: Date, default: Date.now }}],
  podSlug: String,
  podTitle: String,
  podLink: String
});

module.exports = mongoose.model('Item', itemSchema);