module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.BIGINT,
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        User.hasOne(models.Item, { as: 'Current' });
        User.hasMany(models.Item, { as: 'Subscribed' });
        User.hasMany(models.Playlist);      
      }
    }
  });
  return User;
};