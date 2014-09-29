module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    data: {
      type: DataTypes.TEXT,
      get: function() {
        return JSON.parse(this.getDataValue('data'));
      },
      set: function(v) {
        this.setDataValue('data', JSON.stringify(v)); 
      }
    },
    url: DataTypes.STRING,
    pubDate: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Feed);
        Item.hasMany(models.User, {as:'History', through:'History'});
        Item.hasMany(models.User, {as:'Skipped', through:'Skipped'});
      }
    }
  });
  return Item;
};