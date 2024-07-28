module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('MenuItem', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    return MenuItem;
  };
  