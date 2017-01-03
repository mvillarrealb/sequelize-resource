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
let visitsCounter = {};
const controller = new CrudController(resource,{
  primaryKeyURL:"/:id([0-9]+)",
  sendResponse: (req,res,next,response) => {
    response.page_visits = visitsCounter;
    response.scenario = req.scenario;
    res.status(response.status).send(response);
  },
  middleware: {
    before: {
      findAll: function(req,res,next) {
        req.scenario = "findAll";
        next();
      },
      findOne: function(req,res,next) {
        req.scenario = "findOne";
        next();
      },
      create: function(req,res,next) {
        req.scenario = "create";
        next();
      },
      update: function(req,res,next) {
        req.scenario = "update";
        next();
      },
      destroy: function(req,res,next) {
        req.scenario = "destroy";
        next();
      },
      bulkCreate: function(req,res,next) {
        req.scenario = "bulkCreate";
        next();
      },
    },
    after: function(req,res) {
      if(req && req.scenario){
        if(!visitsCounter[req.scenario]) {
          visitsCounter[req.scenario] = 0;
        }
        visitsCounter[req.scenario] += 1;
      }
    }
  }
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
