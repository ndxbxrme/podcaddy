module.exports = function(sequelize, DataTypes) {
  var Playlist = sequelize.define('Playlist', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Playlist.hasMany(models.Feed);
        Playlist.belongsTo(models.User);
      }
    }
  });
  return Playlist;
};