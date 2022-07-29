'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom id_user di tabel Products sebagai foreign key dari tabel Users
    await queryInterface.addColumn('Products', 'id_user',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          defaultValue: null
        })
    // Menambahkan kolom id_category di tabel Products sebagai foreign key dari tabel Categories
    await queryInterface.addColumn('Products', 'id_category',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Categories',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          defaultValue: null
        })
    
  },

  async down (queryInterface, Sequelize) {
    // Menghapus colom id_user di tabel products
    await queryInterface.removeColumn('Products','id_user');
    // Menghapus colom id_cateogry di tabel products
    await queryInterface.removeColumn('Products','id_category');
  }
};
