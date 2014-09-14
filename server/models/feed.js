module.exports = function(sequelize, DataTypes) {
  var Feed = sequelize.define('Feed', {
    url: DataTypes.STRING,
    data: {
      type: DataTypes.TEXT,
      get: function() {
        return JSON.parse(this.getDataValue('data'));
      },
      set: function(v) {
        return JSON.stringify(v); 
      }
    }
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