'use strict';
const cityData = require('../masterdata/cities.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cities',cityData,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities',null,{truncate: true, restartIdentity: true});
  }
};
