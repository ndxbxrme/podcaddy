module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
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
        Item.belongsTo(models.Feed);
      }
    }
  });
  return Item;
};