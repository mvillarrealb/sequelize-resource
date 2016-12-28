module.exports = (db)=> {
  const sequelizeResource = require("../../../")(db.sequelize,db.Sequelize);
  const controllers = {
    Task: require("./TaskController")(sequelizeResource,db)
  };
  return controllers;
}
