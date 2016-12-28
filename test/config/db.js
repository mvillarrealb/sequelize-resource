const Sequelize = require("sequelize");
const config    = require("./config");
const sequelize = new Sequelize(config.database,config.username,config.password,config);

const person = sequelize.define("person",{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(200),
    allowNull: false,
    validate:{
      notEmpty: true
    }
  },
  last_name: {
    type: Sequelize.STRING(200),
    allowNull: false,
    validate:{
      notEmpty: true
    }
  },
  address: {
    type: Sequelize.STRING
  },
  birth_date:{
    type: Sequelize.DATE,
    allowNull: false,
    validate:{
      notEmpty: true
    }
  },
  identity_doc:{
    type: Sequelize.STRING(20),
    allowNull: false,
    validate:{
      notEmpty: true
    }
  }
});

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  person: person
}
