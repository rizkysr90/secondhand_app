'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom is_done di tabel Users 
    await queryInterface.addColumn('Orders', 'is_done',
        {
          type: Sequelize.INTEGER,
          defaultValue: null
        })
  },

  async down (queryInterface, Sequelize) {
    // Menghapus colom is_done di tabel Orders
    await queryInterface.removeColumn('Orders','is_done');
  }
};
