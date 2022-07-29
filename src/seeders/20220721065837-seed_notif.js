'use strict';
const notif = require('../masterdata/notifications.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notifications',notif,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications',null,{truncate: true, restartIdentity: true});
  }
};
