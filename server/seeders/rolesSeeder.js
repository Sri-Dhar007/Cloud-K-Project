'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add your seed data creation logic here
    await queryInterface.bulkInsert('Roles', [
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'User', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Add your seed data removal logic here
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
