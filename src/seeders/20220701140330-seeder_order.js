'use strict';
const orderData = require('../masterdata/orders.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders',orderData,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders',null,{truncate: true, restartIdentity: true});
  }
};
