module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Feed);
      }
    }
  });
  return Item;
};