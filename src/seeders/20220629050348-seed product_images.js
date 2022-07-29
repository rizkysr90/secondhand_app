'use strict';
const productImages = require('../masterdata/product_images.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Product_images',productImages,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Product_images',null,{truncate: true, restartIdentity: true});
  }
};
