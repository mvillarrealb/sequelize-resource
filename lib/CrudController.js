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

  static get MIDDLEWARE_GLOBAL() {
    return 1;
  }

  static get MIDDLWARE_LOCAL() {
    return 2;
  }
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

   set afterMiddlewareType(afterMiddlewareType) {
      this._afterMiddlewareType = afterMiddlewareType;
   }

   get afterMiddlewareType() {
      return this._afterMiddlewareType;
   }

   set beforeMiddlewareType(beforeMiddlewareType) {
      this._beforeMiddlewareType = beforeMiddlewareType;
   }

   get beforeMiddlewareType() {
      return this._beforeMiddlewareType;
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

    set middleware(middleware) {
      this._middleware = middleware;
    }

    get middleware() {
      return this._middleware;
    }
    /**
     * Returns the middleware to be executed before your CrudController,
     * the before middleware is defined in the middleware property in this class's
     * constructor, before middleware can be either:
     * An array of middleware functions: In express you can use an array of
     * middleware in your core login, so here you can too.
     *
     * An Middleware function: A simple express  middleware
     *
     * An object defining indivual CRUD middleware combining the before scenarios
     *
     * middleware: {
     *  before: {
     *    findOne: middlewareFnX,
     *    findAll: middlewareFnY,
     *    create: middlewareFnZ,
     *    destroy: middlewareFnQ,
     *    update: middlewareFnN,
     *    bulkCreate: middlewareFnR
     *  }
     *
     * }
     *
     * @return {[type]} [description]
     */
    get before() {
      if(!this._before) {
        if( this.middleware && this.middleware.before ) {
          let middleware = null;
          if( typeof this.middleware.before == "function" ) {
            middleware = [this.middleware.before];
            this.beforeMiddlewareType = CrudController.MIDDLEWARE_GLOBAL;
          } else if( typeof this.middleware.before == "object" ){
            this.beforeMiddlewareType = CrudController.MIDDLEWARE_LOCAL;
            middleware = this.middleware.before;
          } else {
            middleware = this.middleware.before;
            this.beforeMiddlewareType = CrudController.MIDDLEWARE_GLOBAL;
          }
          this._before = middleware;
        }
      }
      return this._before;
    }

    get after() {
      if(!this._after) {
        if( this.middleware && this.middleware.after ) {
          let middleware = null;
          if( typeof this.middleware.after == "function" ) {
            middleware = this.middleware.after;
            this.afterMiddlewareType = CrudController.MIDDLEWARE_GLOBAL;
          } else if( typeof this.middleware.after == "object" ){
            this.afterMiddlewareType = CrudController.MIDDLEWARE_LOCAL;
            middleware = this.middleware.after;
          }
          this._after = middleware;
        }
      }

      return this._after;
    }
    /**
     * FIXME should put this stuff in a util submodule instead of duplicating the method
     * Determines if targetObject is an array
     * @method isArray
     * @param {Mixed} targetObj
     * @return {Boolean}
     */
    isArray (targetObj) {
      return (targetObj && Object.prototype.toString.call( targetObj ) == '[object Array]');
    }


   /**
    * @method processBeforeMiddleware
    */
   processBeforeMiddleware() {
     let findOne    = [];
     let findAll    = [];
     let create     = [];
     let update     = [];
     let destroy    = [];
     let bulkCreate = [];

     if( this.before != null ) {
       if( this.beforeMiddlewareType == CrudController.MIDDLEWARE_LOCAL ) {
         if(this.before.findOne) {
           if(this.isArray(this.before.findOne)){
             findOne = this.before.findOne;
           } else if(typeof (this.before.findOne) == "function"){
              findOne.push(this.before.findOne);
           } else {
             console.warn("Invalid before findOne middleware, must be a function or array of functions");
           }
         }

         if(this.before.findAll) {
           if(this.isArray(this.before.findAll)){
             findAll = this.before.findAll;
           }  else if(typeof (this.before.findAll) == "function"){
              findAll.push(this.before.findAll);
           } else {
             console.warn("Invalid before findAll middleware, must be a function or array of functions");
           }
         }

         if(this.before.create) {
           if(this.isArray(this.before.create)){
             create = this.before.create;
           }  else if(typeof (this.before.create) == "function"){
             create.push(this.before.create);
           } else {
             console.warn("Invalid before create middleware, must be a function or array of functions");
           }
         }

         if(this.before.destroy) {
           if(this.isArray(this.before.destroy)){
             destroy = this.before.destroy;
           }  else if(typeof (this.before.destroy) == "function"){
             destroy.push(this.before.destroy);
           } else {
             console.warn("Invalid before destroy middleware, must be a function or array of functions");
           }
         }

         if(this.before.bulkCreate) {
           if(this.isArray(this.before.bulkCreate)){
             bulkCreate = this.before.bulkCreate;
           } else if(typeof (this.before.bulkCreate) == "function"){
             bulkCreate.push(this.before.bulkCreate);
           }else {
             console.warn("Invalid before bulkCreate middleware, must be a function or array of functions");
           }
         }

         if(this.before.update) {
           if(this.isArray(this.before.update)){
             update = this.before.update;
           }  else if(typeof (this.before.update) == "function"){
             update.push(this.before.update);
           } else {
             console.warn("Invalid before update middleware, must be a function or array of functions");
           }
         }

       } else if(this.beforeMiddlewareType == CrudController.MIDDLEWARE_GLOBAL) {
         findOne = this.before;
         findAll = this.before;
         create = this.before;
         update = this.before;
         destroy = this.before;
         bulkCreate = this.before;
       }
     }
     return {
        findOne: findOne,
        findAll: findAll,
        create: create,
        update: update,
        bulkCreate: bulkCreate,
        destroy: destroy
     };
   }
   /**
    * @method processAfterMiddleware
    * @param {Object} middlewareStack
    * @return {Object}
    */
   processAfterMiddleware(middlewareStack) {

     if( this.after != null ) {

       if( this.afterMiddlewareType == CrudController.MIDDLEWARE_LOCAL ) {
         if( this.after.findOne ) {
           if(typeof (this.after.findOne) == "function"){
              let afterMiddleware = this.afterResponse(this.after.findOne);
              middlewareStack.findOne.push(afterMiddleware);
           } else {
             console.warn("Invalid after findOne middleware, must be a function or array of functions");
           }
         }

         if( this.after.findAll ) {
           if( typeof (this.after.findAll) == "function" ){
              let afterMiddleware = this.afterResponse(this.after.findAll);
              middlewareStack.findAll.push(afterMiddleware);
           } else {
             console.warn("Invalid after findAll middleware, must be a function or array of functions");
           }
         }

         if( this.after.create ) {
           if( typeof (this.after.create) == "function" ){
              let afterMiddleware = this.afterResponse(this.after.create);
             middlewareStack.create.push(afterMiddleware);
           } else {
             console.warn("Invalid after create middleware, must be a function or array of functions");
           }
         }

         if( this.after.destroy ) {
           if( typeof (this.after.destroy) == "function" ){
              let afterMiddleware = this.afterResponse(this.after.destroy);
             middlewareStack.destroy.push(afterMiddleware);
           } else {
             console.warn("Invalid after destroy middleware, must be a function or array of functions");
           }
         }

         if( this.after.bulkCreate ) {
           if( typeof (this.after.bulkCreate) == "function" ){
              let afterMiddleware = this.afterResponse(this.after.bulkCreate);
             middlewareStack.bulkCreate.push(afterMiddleware);
           } else {
             console.warn("Invalid after bulkCreate middleware, must be a function or array of functions");
           }
         }

         if( this.after.update ) {
           if( typeof (this.after.update) == "function" ){
              let afterMiddleware = this.afterResponse(this.after.update);
             middlewareStack.update.push(afterMiddleware);
           } else {
             console.warn("Invalid after update middleware, must be a function or array of functions");
           }
         }

       } else if(this.afterMiddlewareType == CrudController.MIDDLEWARE_GLOBAL) {
         if( typeof this.after == "function") {
           let afterMiddleware = this.afterResponse(this.after);
           middlewareStack.findOne.push(afterMiddleware);
           middlewareStack.findAll.push(afterMiddleware);
           middlewareStack.create.push(afterMiddleware);
           middlewareStack.update.push(afterMiddleware);
           middlewareStack.destroy.push(afterMiddleware);
           middlewareStack.bulkCreate.push(afterMiddleware);

         } else {
           console.warn("Invalid after GLOBAL middleware, must be a function or array of functions");
         }
       }
     }

     return middlewareStack;
   }
   /**
    * Attaches controller functionality according to user definition,
    * the controller has a default behavior which is built from an
    * array of before > action > after middlewares
    * described as follows:
    * before
    * action
    * after
    * @method attachController
    * @param {Express.Router} router
    */
   attachController(router) {
     let middlewareStack = this.processBeforeMiddleware();
     middlewareStack = this.processAfterMiddleware(middlewareStack);

     middlewareStack.findOne.push(this.findOne.bind(this));
     middlewareStack.findAll.push(this.findAll.bind(this));

     middlewareStack.create.push(bodyParser.json());
     middlewareStack.create.push(this.validateJSON.bind(this));
     middlewareStack.create.push(this.create.bind(this));

     middlewareStack.update.push(bodyParser.json());
     middlewareStack.update.push(this.validateJSON.bind(this));
     middlewareStack.update.push(this.update.bind(this));

     middlewareStack.destroy.push(this.destroy.bind(this));

     middlewareStack.bulkCreate.push(bodyParser.json());
     middlewareStack.bulkCreate.push(this.validateJSON.bind(this));
     middlewareStack.bulkCreate.push(this.bulkCreate.bind(this));

     router.route("/").get(middlewareStack.findAll);
     router.route("/").post(middlewareStack.create);
     router.route("/batch").post(middlewareStack.bulkCreate);

     router.route(this.primaryKeyURL).put(middlewareStack.update);
     router.route(this.primaryKeyURL).get(middlewareStack.findOne);
     router.route(this.primaryKeyURL).delete(middlewareStack.destroy);
   }

   afterResponse(endMiddleware) {
     return function(req,res,next) {
       req.on("end",function(){
         endMiddleware.call(this,req,res);
       });
       next();
     }
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
          let transformedResponse = this.createResponse({
            httpCode: 201,
            message: "created",
            data: response
          });

          if( this.sendResponse && typeof this.sendResponse == "function"){
            this.sendResponse(req,res,next,transformedResponse);
          } else if(this.sendResponse && this.sendResponse.create) {
            this.sendResponse.create(req,res,next,transformedResponse);
          } else {
            res.status(201).send(this.createResponse({
              httpCode: 201,
              message: "created",
              data: response
            }));
          }

       }).catch((error) => {
         let responseCode = 500;
         let response = null;

         if ( error instanceof CrudException) {
           responseCode = error.errorCode;
           response = this.createResponse({
             httpCode: error.errorCode,
             message: error.message,
             errors: error.errors
           });
         } else {
           response = this.createResponse({
             httpCode: 500,
             message: "error_creating",
             errors: [error]
           });
         }

         if( this.sendResponse && typeof this.sendResponse == "function"){
           this.sendResponse(req,res,next,response);
         } else if( this.sendResponse && this.sendResponse.create ) {
           this.sendResponse.create(req,res,next,response);
         } else {
            res.status(responseCode).send(response);
         }
       });

     } else {
       let invalidContentResponse = this.createResponse({
         httpCode:422,
         message: "content_type_json"
       });

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,invalidContentResponse);
       } else if( this.sendResponse && this.sendResponse.create ) {
         this.sendResponse.create(req,res,next,invalidContentResponse);
       } else {
         res.status(422).send(invalidContentResponse);
       }
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
       let formattedResponse = this.createResponse({
         httpCode: 200,
         message: "updated",
         data: response
       });

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,formattedResponse);
       } else if( this.sendResponse && this.sendResponse.update ) {
         this.sendResponse.update(req,res,next,formattedResponse);
       } else {
         res.status(200).send(formattedResponse);
      }

     }).catch((error) => {
       let responseCode = 500;
       let response = null;
       if ( error instanceof CrudException) {
         responseCode = error.errorCode;
         response = this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         });

       } else {
         response = this.createResponse({
           httpCode: 500,
           message: "error_updating",
           errors: [error]
         });
       }

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,response);
       } else if(this.sendResponse && this.sendResponse.update) {
         this.sendResponse.update(req,res,next,response);
       } else {
         res.status(responseCode).send(response);
       }

     });
   }
   /**
    * @method destroy
    */
   destroy (req,res,next) {
     this.model.destroy(req.params).then((response) => {
       let formattedResponse = this.createResponse({
         httpCode: 202,
         message: "deleted",
         data: response
       });

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,formattedResponse);
       } else if(this.sendResponse && this.sendResponse.destroy) {
         this.sendResponse.destroy(req,res,next,formattedResponse);
       } else {
         res.status(202).send(formattedResponse);
      }

     }).catch((error) => {
       let responseCode = 500;
       let response = null;
       if (error instanceof CrudException) {
         responseCode = error.errorCode;
         response = this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         });
       } else {
         response = this.createResponse({
           httpCode: 500,
           message: "error_deleting",
           errors: [error]
         });
       }

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,response);
       } else if(this.sendResponse && this.sendResponse.destroy) {
         this.sendResponse.destroy(req,res,next,response);
       } else {
         res.status(responseCode).send(response);
       }
     });
   }
   /**
    * @method findOne
    */
   findOne (req,res,next) {
     this.model.findOne(req.params).then((response) => {
       let formattedResponse = this.createResponse({
         httpCode: 200,
         message: "resource_found",
         data: response
       });

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,formattedResponse);
       } else if(this.sendResponse && this.sendResponse.findOne) {
         this.sendResponse.findOne(req,res,next,formattedResponse);
       } else {
         res.status(200).send(formattedResponse);
       }

     }).catch((error) => {
       let responseCode = 500;
       let response = null;
       if (error instanceof CrudException) {
         responseCode = error.errorCode;
         response = this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         });
       } else {
         response = this.createResponse({
           httpCode: responseCode,
           message: "error_finding",
           errors: [error]
         });
       }

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,response);
       } else if(this.sendResponse && this.sendResponse.findOne) {
         this.sendResponse.findOne(req,res,next,response);
       } else {
          res.status(responseCode).send(response);
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
       let formattedResponse = this.createResponse({
         httpCode: 200,
         message: "resources_found",
         data: response
       });

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,formattedResponse);
       } else if(this.sendResponse && this.sendResponse.findAll) {
         this.sendResponse.findAll(req,res,next,formattedResponse);
       } else {
         res.status(200).send(formattedResponse);
      }

     }).catch((error) => {
       let response = this.createResponse({
         httpCode: 500,
         message: "error_finding",
         errors: [error]
       });
       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,response);
       } else if(this.sendResponse && this.sendResponse.findAll) {
         this.sendResponse.findAll(req,res,next,response);
       } else {
         res.status(500).send(response);
       }

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
       let formattedResponse = this.createResponse({
         httpCode: 201,
         message: "bulk_created",
         data: response
       });

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,formattedResponse);
       } else if(this.sendResponse && this.sendResponse.bulkCreate) {
         this.sendResponse.bulkCreate(req,res,next,formattedResponse);
       } else {
         res.status(201).send(formattedResponse);
      }

     }).catch((error) => {
       let responseCode = 500;
       let response = null;
       if (error instanceof CrudException) {
         responseCode = error.errorCode;
         response = this.createResponse({
           httpCode: error.errorCode,
           message: error.message,
           errors: error.errors
         });
       } else {
         response = this.createResponse({
           httpCode: 500,
           message: "error_bulkcreating",
           errors: [error]
         });
       }

       if( this.sendResponse && typeof this.sendResponse == "function"){
         this.sendResponse(req,res,next,response);
       } else if(this.sendResponse && this.sendResponse.bulkCreate) {
         this.sendResponse.bulkCreate(req,res,next,response);
       } else {
          res.status(responseCode).send(response);
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
