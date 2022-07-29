'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const foreignKeyProductOrder = {
        foreignKey : 'product_id'
      }
      const foreignKeyBuyerOrder = {
        foreignKey : 'buyer_id',
        as : 'Buyers'
      }
      const foreignKeySellerOrder = {
        foreignKey : 'seller_id',
        as : 'Sellers'
      }

      // define association here
      const UserSeller = models.User;
      const UserBuyer = models.User;
      const Product = models.Product;
      const Order = models.Order;

      Product.hasMany(Order,foreignKeyProductOrder);
      Order.belongsTo(Product,foreignKeyProductOrder);

      UserBuyer.hasMany(Order,foreignKeyBuyerOrder);
      Order.belongsTo(UserBuyer,foreignKeyBuyerOrder);

      UserSeller.hasMany(Order,foreignKeySellerOrder);
      Order.belongsTo(UserSeller,foreignKeySellerOrder);
    }
  }
  Order.init({
    price: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_done: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};