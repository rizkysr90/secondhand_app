'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const foreignkeyNotifikasi_objectNotifikasi = {
        foreignKey: 'notification_object_id'
      }
      const foreignkeyUserNotifikasi = {
        foreignKey: 'user_id'
      }

      // define association here
      const Notification = models.Notification;
      const Notification_object = models.Notification_object;
      const User = models.User;

      Notification_object.hasMany(Notification, foreignkeyNotifikasi_objectNotifikasi)
      Notification.belongsTo(Notification_object, foreignkeyNotifikasi_objectNotifikasi)

      User.hasMany(Notification, foreignkeyUserNotifikasi)
      Notification.belongsTo(User, foreignkeyUserNotifikasi)

    }
  }
  Notification.init({
    notification_object_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};