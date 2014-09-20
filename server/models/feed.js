module.exports = function(sequelize, DataTypes) {
  var Feed = sequelize.define('Feed', {
    url: DataTypes.STRING,
    data: {
      type: DataTypes.TEXT,
      get: function() {
        return JSON.parse(this.getDataValue('data'));
      },
      set: function(v) {
        this.setDataValue('data', JSON.stringify(v)); 
      }
    },
    pubDate: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Feed.hasMany(models.Item);
        Feed.belongsTo(models.User);
        Feed.hasMany(models.User, {as:'Subscribed'});
        Feed.hasMany(models.Playlist);
      }
    }
  });
  return Feed;
};