'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const foreignKeyCityUser = {
        foreignKey: 'city_id',
      }

      // define association
      const City = models.City
      const User = models.User

      City.hasMany(User,foreignKeyCityUser);
      User.belongsTo(City,foreignKeyCityUser);


    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    profile_picture_id: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING,
    city_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    confirm_email : DataTypes.BOOLEAN,
    username : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};