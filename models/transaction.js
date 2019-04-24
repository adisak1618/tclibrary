'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    book_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    return: DataTypes.BOOLEAN
  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
    models.transaction.belongsTo(models.user, { as: 'transaction_owner', foreignKey: 'user_id', targetKey: 'id' });
    models.transaction.belongsTo(models.book, { as: 'renter', foreignKey: 'book_id', targetKey: 'id' });
  };
  return transaction;
};