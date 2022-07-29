'use strict';
const categoryData = require('../masterdata/categories.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',categoryData,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories',null,{truncate: true, restartIdentity: true});
  }
};
