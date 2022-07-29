'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const foreignKeyProductProductImage = {
        foreignKey : 'product_id'
      }
      // define association here
      const Product = models.Product;
      const ProductImage = models.Product_image;

      Product.hasMany(ProductImage,foreignKeyProductProductImage);
      ProductImage.belongsTo(Product,foreignKeyProductProductImage);
    }
  }
  Product_image.init({
    name: DataTypes.STRING,
    url_image: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    product_image_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product_image',
  });
  return Product_image;
};