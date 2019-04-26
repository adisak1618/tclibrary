'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_code: DataTypes.INTEGER,
    nickname: DataTypes.STRING,
    fullname: DataTypes.STRING,
    user_class: DataTypes.STRING,
    age: DataTypes.INTEGER,
    tel: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    models.user.hasOne(models.line_user, { as: 'lineUser', foreignKey: 'user_id', targetKey: 'id' });
    models.user.hasMany(models.transaction, { as: 'transaction', foreignKey: 'user_id', targetKey: 'id' });
  };
  return user;
};