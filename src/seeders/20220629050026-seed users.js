'use strict';
const bcrypt = require('bcrypt')
const usersData = require('../masterdata/users.json').map((eachData) => {
  eachData.createdAt = new Date();
  eachData.updatedAt = new Date();
  eachData.password =  bcrypt.hashSync(eachData.password,+process.env.SALT_ROUNDS);
  return eachData;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',usersData,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users',null,{truncate: true, restartIdentity: true});
  }
};
