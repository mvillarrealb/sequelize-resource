"use strict";

let server       = null;
const express    = require("express");
const app        = express();
const router     = express.Router();
const db         = require("../config/db");

const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const model     = db.person;

const CrudController = require("../../lib/CrudController");
const SequelizeModel = require("../../lib/SequelizeModel")(sequelize,Sequelize);

const resource = new SequelizeModel(model);
const controller = new CrudController(resource,{
  primaryKeyURL:"/:id([0-9]+)"
});

controller.attachController(router);
app.use("/persons",router);

module.exports = {
  dbSync: function(){
    return new Promise((resolve,reject) => {
      sequelize.sync({force: true}).then(()=>{
        return resolve();
      }).catch((err)=>{
        reject(err);
      })
    });
  },
  start: function(port,callback) {
    server = app.listen(port,callback);
  },
  stop: function(callback) {
    server.close(callback);
  }
};
