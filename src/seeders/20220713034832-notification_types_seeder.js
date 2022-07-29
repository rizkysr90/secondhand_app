'use strict';
const notif_types = require('../masterdata/notification_types.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notification_types',notif_types,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notification_types',null,{truncate: true, restartIdentity: true});
  }
};
