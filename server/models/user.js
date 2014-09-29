module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.BIGINT,
    data: {
      type: DataTypes.TEXT,
      get: function() {
        var d = this.getDataValue('data');
        if(d) {
          return JSON.parse(d);
        } else {
          return {}
        }
      },
      set: function(v) {
        this.setDataValue('data', JSON.stringify(v)); 
      }
    },
    position: DataTypes.BIGINT,
    currentId: DataTypes.BIGINT
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Item, {as: 'History', through:'History'});
        User.hasMany(models.Item, {as: 'Skipped', through:'Skipped'});
        User.hasMany(models.Feed, { as: 'Subscribed' });
        User.hasMany(models.Playlist);      
      }
    }
  });
  return User;
};