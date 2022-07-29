'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      // Menambahkan kolom city_id di tabel Users sebagai foreign key dari tabel Cities
      await queryInterface.addColumn('Users', 'city_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Cities',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          defaultValue: null
        })
  },

  async down (queryInterface, Sequelize) {
    // Menghapus colom city_id di tabel users
    await queryInterface.removeColumn('Users','city_id');
  }
};
