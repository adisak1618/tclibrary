'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  category.associate = function(models) {
    // associations can be defined here
    models.category.hasMany(models.book, { as: 'books', foreignKey: 'book_id', targetKey: 'id' });
  };
  return category;
};