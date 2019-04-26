'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      writer_id: {
        type: Sequelize.INTEGER
      },
      page_count: {
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      publisher: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      isbn_code: {
        type: Sequelize.STRING
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      cover: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('books');
  }
};