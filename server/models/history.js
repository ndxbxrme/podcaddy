module.exports = function(sequelize, DataTypes) {
  var History = sequelize.define('History', {
    skipped: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        History.hasOne(models.User);
        History.hasOne(models.Item);
      }
    }
  });
  return History;
};