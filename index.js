"use strict"
module.exports = (sequelize,Sequelize) => {
  const  SequelizeResource = require("./lib/SequelizeResource")(sequelize,Sequelize);
  return SequelizeResource;
}
