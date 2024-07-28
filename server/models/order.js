module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
    });
  
    return Order;
  };
  