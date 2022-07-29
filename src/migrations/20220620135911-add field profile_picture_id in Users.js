'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom profile_picture_id di tabel Users 
    await queryInterface.addColumn('Users', 'profile_picture_id',
        {
          type: Sequelize.STRING,
          defaultValue: null
        })
  },

  async down (queryInterface, Sequelize) {
    // Menghapus colom profile_picture_id di tabel users
    await queryInterface.removeColumn('Users','profile_picture_id');
  }
};
