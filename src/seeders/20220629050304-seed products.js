'use strict';
const productsData = require('../masterdata/products.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products',productsData,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products',null,{truncate: true, restartIdentity: true});
  }
};
