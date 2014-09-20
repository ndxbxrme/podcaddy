module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.BIGINT,
    data: {
      type: DataTypes.TEXT,
      get: function() {
        return JSON.parse(this.getDataValue('data'));
      },
      set: function(v) {
        this.setDataValue('data', JSON.stringify(v)); 
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasOne(models.Item, { as: 'Current' });
        User.hasMany(models.Feed, { as: 'Subscribed' });
        User.hasMany(models.Playlist);      
      }
    }
  });
  return User;
};