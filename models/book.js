'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    name: DataTypes.STRING,
    writer_id: DataTypes.INTEGER,
    page_count: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    publisher: DataTypes.STRING,
    price: DataTypes.INTEGER,
    isbn_code: DataTypes.STRING,
    count: DataTypes.INTEGER,
    cover: DataTypes.STRING
  }, {});
  book.associate = function(models) {
    // associations can be defined here
    models.book.hasMany(models.transaction, { as: 'transaction', foreignKey: 'book_id', targetKey: 'id' });
    models.book.belongsTo(models.category, { as: 'category', foreignKey: 'category_id', targetKey: 'id' });
    models.book.belongsTo(models.writer, { as: 'writer', foreignKey: 'writer_id', targetKey: 'id' });
  };
  return book;
};