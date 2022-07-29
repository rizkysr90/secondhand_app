'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      // Menambahkan kolom product_id di tabel Product_images sebagai foreign key dari tabel Products
      await queryInterface.addColumn('Product_images', 'product_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          defaultValue: null
        })
  },

  async down (queryInterface, Sequelize) {
    // Menghapus colom product_id di tabel Product_images
    await queryInterface.removeColumn('Product_images','product_id');
  }
};
