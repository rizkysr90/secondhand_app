'use strict';
const notifObject = require('../masterdata/notifications_object.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notification_objects',notifObject,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notification_objects',null,{truncate: true, restartIdentity: true});
  }
};
