const Sequelize = require("sequelize");
const config    = require("../config/config");
const sequelize = new Sequelize(config.database,config.username,config.password,config);
const db = {
  Task: require("./Task")(sequelize,Sequelize),
  sequelize: sequelize,
  Sequelize: Sequelize
};

module.exports = db;
