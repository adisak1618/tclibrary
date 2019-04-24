'use strict';
module.exports = (sequelize, DataTypes) => {
  const writer = sequelize.define('writer', {
    name: DataTypes.STRING
  }, {});
  writer.associate = function(models) {
    // associations can be defined here
    models.writer.hasMany(models.book, { as: 'portfolio', foreignKey: 'book_id', targetKey: 'id' });
  };
  return writer;
};