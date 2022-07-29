'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Menambahkan kolom product_id di tabel Orders sebagai foreign key dari tabel Products
    await queryInterface.addColumn('Orders', 'product_id',
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
    // Menambahkan kolom buyer_id di tabel Orders sebagai foreign key dari tabel Users
    await queryInterface.addColumn('Orders', 'buyer_id',
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
    // Menambahkan kolom seller_id di tabel Orders sebagai foreign key dari tabel Users
    await queryInterface.addColumn('Orders', 'seller_id',
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
    
  },

  async down (queryInterface, Sequelize) {
    // Menghapus colom product_id di tabel orders
    await queryInterface.removeColumn('Orders','product_id');
    // Menghapus colom buyer_id di tabel orders
    await queryInterface.removeColumn('Orders','buyer_id');
    // Menghapus colom seller_id di tabel orders
    await queryInterface.removeColumn('Orders','seller_id');
  }
};
