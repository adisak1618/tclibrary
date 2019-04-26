'use strict';
module.exports = (sequelize, DataTypes) => {
  const line_user = sequelize.define('line_user', {
    user_id: DataTypes.INTEGER,
    lineid: DataTypes.STRING,
    path: DataTypes.STRING,
    follow: DataTypes.BOOLEAN
  }, {});
  line_user.associate = function(models) {
    // associations can be defined here
    models.line_user.belongsTo(models.user, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
    models.line_user.hasMany(models.action, { as: 'jobs', foreignKey: 'line_user_id', targetKey: 'id' });
  };
  return line_user;
};