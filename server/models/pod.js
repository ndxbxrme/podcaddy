'use strict';

var mongoose = require('mongoose');

var podSchema = mongoose.Schema({
  url: String,
  link: String,
  title: String,
  titleSlug: String,
  description: String,
  shortDesc: String,
  image: String,
  cloudinary: mongoose.Schema.Types.Mixed,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  pubDate: Date,
  featured: {type: Boolean, default: false},
  subscribers: [ { userId: String, date: {type: Date, default: Date.now }}],
  categories: [ String ],
  listensToday: {type: Number, default: 0},
  listensWeek: {type: Number, default: 0},
  listensAlltime: {type: Number, default: 0},
  noItems: {type: Number, default: 0}
});

module.exports = mongoose.model('Pod', podSchema);