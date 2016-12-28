"use strict"

const CrudException = require("./CrudException");
const bodyParser = require("body-parser");
/**
 * CrudController class uses a SequelizeModel to create a CRUD based
 * router, allows to easily attach middlewares before and after execution,
 * also enable support for complex functionality such as response hyperlinks
 *
 * @class CrudController
 * @author Marco Villarreal
 */
class CrudController {
   /**
    * @constructor
    * @param {SequelizeModel} sequelizeModel
    * @param {Object} options
    */
   constructor(sequelizeModel,options) {
     this.model = sequelizeModel;
     for(let property in options){
       this[property] = options[property];
     }
   }

   set endPoint(endPoint) {
     this._endPoint = endPoint;
   }

   get endPoint() {
     return this._endPoint;
   }
   /**
    *
    * @param  {[type]} model [description]
    * @return {[type]}       [description]
    */
   set model(model) {
     this._model = model;
   }

   get model() {
     return this._model;
   }

   set before(before) {

   }

   get before() {

   }

   set after(after) {

   }

   get after () {

   }
   /**
    * @method attachController
    * @param {Express.Router} router
    */
   attachController(router) {
     router.use(bodyParser.json());
     router.route("/").get(this.findAll.bind(this));

     router.route("/").post([
       this.validateJSON.bind(this),
       this.create.bind(this)
     ]);

     router.route("/batch").post([
       this.validateJSON.bind(this),
       this.bulkCreate.bind(this)
     ]);

     router.route(this.primaryKeyURL).put([
       this.validateJSON.bind(this),
       this.update.bind(this)
     ]);
     
     router.route(this.primaryKeyURL).get(this.findOne.bind(this));
     router.route(this.primaryKeyURL).delete(this.destroy.bind(this));
   }
   /**
    * Middleware to check wether the request is or not application/json
    */
   validateJSON(req,res,next) {
     if (!req.is("application/json")) {
       res.status(422).send(this.createResponse({
         httpCode:422,
         message: "content_type_json"
       }));
     } else {
       next();
     }
   }
   /**
    * @method create
    * @param {Request} req
    * @param {Response} res
    * @param {Function} next
    */
   create(req,res,next) {
     if ( req.is("application/json") ) {
       this.model.save(req.body).then((response) => {
         res.status(201).send(this.createResponse({
           httpCode: 201,
           message: "created",
           data: response
         }));
       }).catch((error) => {
         if( error instanceof CrudException) {
           res.status(error.errorCode).send(this.createResponse({
             httpCode: error.errorCode,
             message: error.message,
             errors: error.errors
           }));
         } else {
           res.status(500).send(this.createResponse({
             httpCode: 500,
             message: "error_creating",
             errors: [error]
           }));
         }
       });
     } else {
       res.status(422).send(this.createResponse({
         httpCode:422,
         message: "content_type_json"
       }));
     }

   }
   /**
    *
    *
    * @method update
    * @param {Request} req
    * @param {Response} res
    * @param {Function} next
    */
   update (req,res,next) {
     this.model.update(req.params,req.body).then((response) => {
       res.status(200).send(this.createResponse({
         httpCode: 200,
         message: "updated",
         data: response
       }));
     }).catch((error) => {
       if (error instanceof CrudException) {
         res.status(error.errorCode).send(this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         }));
       } else {
         res.status(500).send(this.createResponse({
           httpCode: 500,
           message: "error_finding",
           errors: [error]
         }));
       }
     });
   }
   /**
    * @method destroy
    */
   destroy (req,res,next) {
     this.model.destroy(req.params).then((response) => {
       res.status(202).send(this.createResponse({
         httpCode: 202,
         message: "deleted",
         data: response
       }));
     })
     .catch((error) => {
       if (error instanceof CrudException) {
         res.status(error.errorCode).send(this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         }));
       } else {
         res.status(500).send(this.createResponse({
           httpCode: 500,
           message: "error_deleting",
           errors: [error]
         }));
       }
     });
   }
   /**
    * @method findOne
    */
   findOne (req,res,next) {
     this.model.findOne(req.params).then((response) => {
       res.status(200).send(this.createResponse({
         httpCode: 200,
         message: "resource_found",
         data: response
       }));
     }).catch((error) => {
       if (error instanceof CrudException) {
         res.status(error.errorCode).send(this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         }));
       } else {
         res.status(500).send(this.createResponse({
           httpCode: 500,
           message: "error_finding",
           errors: [error]
         }));
       }
     });
   }
   /**
    *
    * @method findAll
    * @param {Object} req
    * @param {Object} res
    * @param {Function} next
    */
   findAll (req,res,next) {
     this.model.findAll(req.query).then((response) => {
       res.status(200).send(this.createResponse({
         httpCode: 200,
         message: "resources_found",
         data: response
       }));
     }).catch((error) => {
       res.status(500).send(this.createResponse({
         httpCode: 500,
         message: "error_finding",
         errors: [error]
       }));
     });
   }
   /**
    * @method bulkCreate
    * @param {Object} req
    * @param {Object} res
    * @param {Function} next
    */
   bulkCreate(req,res,next) {
     this.model.bulkCreate(req.body).then((response) => {
       res.status(201).send(this.createResponse({
         httpCode: 201,
         message: "bulk_created",
         data: response
       }));

     }).catch((error) => {
       if (error instanceof CrudException) {
         res.status(error.errorCode).send(this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         }));
       } else {
         res.status(500).send(this.createResponse({
           httpCode: 500,
           message: "error_bulkcreating",
           errors: [error]
         }));
       }
     });
   }
   /**
    * @method createResponse
    * @param {Integer} httpCode
    * @param {String} message
    * @param {Object} data
    * @param {Errors} errors
    */
   createResponse({ httpCode = 200,message = "",data = null,errors = null }) {
     let response = {
       status: httpCode,
       statusMessage : this.getHttpMessage(httpCode),
       message: message,
       data : data,
       errors: errors
     };

     return response;
   }
   /**
    *
    * @method getHttpMessage
    * @param {Int} code
    * @return {String}
    */
   getHttpMessage(code) {
     let me = this;
     if(!me.httpCodes ){
       me.httpCodes = require("./HttpCodes");
     }
     return me.httpCodes[code];
   }
}

module.exports = CrudController;
