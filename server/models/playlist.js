'use strict';

var mongoose = require('mongoose');

var playlistSchema = mongoose.Schema({
  ownerId: mongoose.Schema.Types.ObjectId,
  title: String,
  titleSlug: String,
  description: String,
  shortDesc: String,
  image: String,
  cloudinary: mongoose.Schema.Types.Mixed,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  subscribers: [ String ],
  pods: [ String ]
});

module.exports = mongoose.model('Playlist', playlistSchema);