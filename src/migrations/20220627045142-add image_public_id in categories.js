'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom image_public_id di tabel categories 
    await queryInterface.addColumn('Categories', 'image_public_id',
        {
          type: Sequelize.STRING,
          defaultValue: null
        })
  },

  async down (queryInterface, Sequelize) {
    // Menghapus colom image_public_id di tabel categories
    await queryInterface.removeColumn('Categories','image_public_id');
  }
};
