'use strict';
module.exports = (sequelize, DataTypes) => {
  const action = sequelize.define('action', {
    job: DataTypes.STRING,
    success: DataTypes.BOOLEAN,
    line_user_id: DataTypes.INTEGER,
    step: DataTypes.INTEGER,
    data: DataTypes.JSONB,
    next: DataTypes.STRING,
  }, {});
  action.associate = function(models) {
    // associations can be defined here
  };
  return action;
};