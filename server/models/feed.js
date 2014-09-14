module.exports = function(sequelize, DataTypes) {
  var Feed = sequelize.define('Feed', {
    url: DataTypes.STRING,
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Feed.hasMany(models.Item);
        Feed.belongsTo(models.User);
      }
    }
  });
  return Feed;
};