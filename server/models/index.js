const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connected Successfully..👍");
  })
  .catch((err) => {
    console.log(`Connection Not established ${err}`);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.Branch = require('./branch')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.MenuItem = require('./menuItem')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.OrderItem = require('./orderItem')(sequelize, DataTypes);
db.Review = require('./review')(sequelize, DataTypes);
db.DeliveryPersonnel = require('./deliveryPersonnel')(sequelize, DataTypes);
db.Offer = require('./offer')(sequelize, DataTypes);
db.UserAddress = require('./userAddress')(sequelize, DataTypes);

db.Role.hasMany(db.User);
db.User.belongsTo(db.Role);

db.Branch.hasMany(db.MenuItem);
db.MenuItem.belongsTo(db.Branch);

db.Branch.hasMany(db.Order);
db.Order.belongsTo(db.Branch);

db.Category.hasMany(db.MenuItem);
db.MenuItem.belongsTo(db.Category);

db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

db.MenuItem.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.MenuItem);

db.User.hasMany(db.Review);
db.Review.belongsTo(db.User);

db.MenuItem.hasMany(db.Review);
db.Review.belongsTo(db.MenuItem);

db.User.hasMany(db.UserAddress);
db.UserAddress.belongsTo(db.User);

db.sequelize.sync({force :  false})
  .then(()=>{
      console.log("Re-sync Done ");
  })

  sequelize.query('SET FOREIGN_KEY_CHECKS = 0') // Disable foreign key checks
  .then(() => {
    return sequelize.query('TRUNCATE TABLE name '); // Truncate the table
  })
  .then(() => {
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  })
  .then(() => {
    console.log('Data truncated successfully.');
  })
  .catch(error => {
    console.error('Error truncating data:', error);
  });

module.exports = db;
