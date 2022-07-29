'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const foreignKeyCategoryProduct = {
        foreignKey : 'id_category'
      }
      const foreignKeyUserProduct = {
        foreignKey : 'id_user'
      }
      // define association
      const Product = models.Product;
      const User = models.User;
      const Category = models.Category;

      Category.hasMany(Product,foreignKeyCategoryProduct);
      Product.belongsTo(Category,foreignKeyCategoryProduct);

      User.hasMany(Product,foreignKeyUserProduct);
      Product.belongsTo(User,foreignKeyUserProduct);

    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    id_user: DataTypes.INTEGER,
    id_category: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};