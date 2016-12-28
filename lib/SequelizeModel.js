"use strict"

module.exports = function(sequelize,Sequelize,utils) {
  const CrudException = require("./CrudException");
  /**
   * La clase SequelizeModel es un wrapper que toma un modelo sequelize y añade
   * funionalidades que permiten trabajarlo de forma más sencilla,
   * estas funcionalidades inlcuyen
   *
   * - save: Almacenar un modelo haciendo uso de transacciones envueltas sobre una promesa
   * - update: Actualizar un modelo haciendo uso de transacciones envueltas sobre una promesa
   * - destroy: Elimina un modelo haciendo uso de transacciones envueltas sobre una promesa
   * - findAll: Encuentra todos los modelos de forma páginada usando criterios de ordenamiento y búsqueda(usando promesas)
   * - findOne: Encuentra un modelo usando criterios de búsqueda(usando una promesa)
   * - bulkCreate: Crea múltiples modelos haciendo uso de transacciones envueltas sobre una promesa
   * - bulkDestroy: Edita múltiples modelos haciendo uso de transacciones envueltas sobre una promesa
   * - bulkUpdate: Actualiza múltiples modelos haciendo uso de transacciones envueltas sobre una promesa
   *
   * Adicionalmente puede definir los hooks internos del modelo usando las opciones del constructor
   * Los hooks actualmente implementados son:
   *
   * - beforeCreate
   * - beforeUpdate
   * - beforeDestroy
   * - beforeBulkCreate
   * - beforeBulkUpdate
   * - beforeBulkDestroy
   * - afterCreate
   * - afterUpdate
   * - afterDestroy
   * - afterBulkCreate
   * - afterBulkUpdate
   * - afterBulkDestroy
   *
   * @class SequelizeModel
   * @author Marco Villarreal
   * @version 0.0.1
   * @since 18/12/2016
   *
   */
  class SequelizeModel {

    /**
     *
     * @constructor
     * @param {Sequelize.model} Modelo sequelize a envolver dentro de esta clase
     * @param {Object} options Opciones adicionales para la definición del modelo
     */
    constructor(model,options) {
      this.model = model;
      for(let property in options){
        if( typeof this[property] != "function" ) {
          this[property] = options[property];
        }
      }
      this.attachHooks();
    }
    /**
     * @private
     * @method attachHooks
     *
     */
    attachHooks() {
      if(this.beforeCreate && typeof this.beforeCreate == "function" ) {
        this.model.addHook("beforeCreate","beforeCreate01",this.beforeCreate);
      }

      if(this.beforeUpdate && typeof this.beforeUpdate == "function" ) {
        this.model.addHook("beforeUpdate","beforeUpdate01",this.beforeUpdate);
      }

      if(this.beforeDestroy && typeof this.beforeDestroy == "function" ) {
        this.model.addHook("beforeDestroy","beforeDestroy01",this.beforeDestroy);
      }

      if(this.afterCreate && typeof this.afterCreate == "function" ) {
        this.model.addHook("afterCreate","afterCreate01",this.afterCreate);
      }

      if(this.afterUpdate && typeof this.afterUpdate == "function" ) {
        this.model.addHook("afterUpdate","afterUpdate01",this.afterUpdate);
      }

      if(this.afterDestroy && typeof this.afterDestroy == "function" ) {
        this.model.addHook("afterDestroy","afterDestroy01",this.afterDestroy);
      }

      if(this.beforeBulkCreate && typeof this.beforeBulkCreate == "function" ) {
        this.model.addHook("beforeBulkCreate","beforeCreate01",this.beforeBulkCreate);
      }

      if(this.beforeBulkUpdate && typeof this.beforeBulkUpdate == "function" ) {
        this.model.addHook("beforeBulkUpdate","beforeBulkUpdate01",this.beforeBulkUpdate);
      }

      if(this.beforeBulkDestroy && typeof this.beforeBulkDestroy == "function" ) {
        this.model.addHook("beforeBulkDestroy","beforeBulkDestroy01",this.beforeBulkDestroy);
      }

      if(this.afterBulkCreate && typeof this.afterBulkCreate == "function" ) {
        this.model.addHook("afterBulkCreate","afterCreate01",this.afterBulkCreate);
      }

      if(this.afterBulkUpdate && typeof this.afterBulkUpdate == "function" ) {
        this.model.addHook("afterBulkUpdate","afterBulkUpdate01",this.afterBulkUpdate);
      }

      if(this.afterBulkDestroy && typeof this.afterBulkDestroy == "function" ) {
        this.model.addHook("afterBulkDestroy","afterBulkDestroy01",this.afterBulkDestroy);
      }

    }
    /**
     * Removes the crud basic hooks attached vía SequelizeModel class
     * @method clearHooks
     */
    clearHooks() {
      this.model.removeHook("beforeCreate","beforeCreate01");
      this.model.removeHook("beforeUpdate","beforeUpdate01");
      this.model.removeHook("beforeDestroy","beforeDestroy01");

      this.model.removeHook("afterCreate","afterCreate01");
      this.model.removeHook("afterUpdate","afterUpdate01");
      this.model.removeHook("afterDestroy","afterDestroy01");

      this.model.removeHook("beforeBulkCreate","beforeCreate01");
      this.model.removeHook("beforeBulkUpdate","beforeBulkUpdate01");
      this.model.removeHook("beforeBulkDestroy","beforeBulkDestroy01");

      this.model.removeHook("afterBulkCreate","afterCreate01");
      this.model.removeHook("afterBulkUpdate","afterBulkUpdate01");
      this.model.removeHook("afterBulkDestroy","afterBulkDestroy01");

    }
    /**
     * Método setter que asigna la propiedad model(modelo sequelize)
     * @method set model
     * @param  {Sequelize.model} model Modelo sequelize
     */
    set model(model) {
      this._model = model;
    }
    /**
     * Retorna el modelo sequelize
     * @method get model
     * @return {Sequelize.model} Modelo sequelize envuelto en esta clase
     */
    get model() {
      return this._model;
    }

    /**
     * Método setter para el hook sequelize beforeCreate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method beforeCreate
     * @param  {function} beforeCreate Función hook a definir para el escenario beforeCreate
     */
    set beforeCreate(beforeCreate) {
      this._beforeCreate = beforeCreate;
    }
    /**
     * Retorna el hook sequelize beforeCreate
     * @method beforeCreate
     * @return {function}
     */
    get beforeCreate() {
      return this._beforeCreate;
    }

    /**
     * Método setter para el hook sequelize beforeUpdate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method beforeUpdate
     * @param  {function} beforeUpdate Función hook a definir para el escenario beforeUpdate
     */
    set beforeUpdate(beforeUpdate) {
      this._beforeUpdate = beforeUpdate;
    }

    /**
     * Retorna el hook sequelize beforeUpdate
     * @method beforeUpdate
     * @return {function}
     */
    get beforeUpdate() {
      return this._beforeUpdate;
    }
    /**
     * Método setter para el hook sequelize beforeDestroy
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method beforeDestroy
     * @param  {function} beforeDestroy Función hook a definir para el escenario beforeDestroy
     */
    set beforeDestroy(beforeDestroy) {
      this._beforeDestroy = beforeDestroy;
    }

    /**
     * Retorna el hook sequelize beforeDestroy
     * @method beforeDestroy
     * @return {function}
     */
    get beforeDestroy() {
      return this._beforeDestroy;
    }
    /**
     * Método setter para el hook sequelize afterCreate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method afterCreate
     * @param  {function} afterCreate Función hook a definir para el escenario afterCreate
     */
    set afterCreate(afterCreate) {
      this._afterCreate = afterCreate;
    }

    /**
     * Retorna el hook sequelize afterCreate
     * @method afterCreate
     * @return {function}
     */
    get afterCreate() {
      return this._afterCreate;
    }

    /**
     * Método setter para el hook sequelize afterCreate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method afterCreate
     * @param  {function} afterCreate Función hook a definir para el escenario afterCreate
     */
    set afterCreate(afterCreate) {
      this._afterCreate = afterCreate;
    }

    /**
     * Retorna el hook sequelize afterCreate
     * @method afterCreate
     * @return {function}
     */
    get afterCreate() {
      return this._afterCreate;
    }

    /**
     * Método setter para el hook sequelize afterUpdate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method afterUpdate
     * @param  {function} afterUpdate Función hook a definir para el escenario afterUpdate
     */
    set afterUpdate(afterUpdate) {
      this._afterUpdate = afterUpdate;
    }

    /**
     * Retorna el hook sequelize afterUpdate
     * @method afterUpdate
     * @return {function}
     */
    get afterUpdate() {
      return this._afterUpdate;
    }

    /**
     * Método setter para el hook sequelize afterDestroy
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method afterDestroy
     * @param  {function} afterDestroy Función hook a definir para el escenario afterDestroy
     */
    set afterDestroy(afterDestroy) {
      this._afterDestroy = afterDestroy;
    }

    /**
     * Retorna el hook sequelize afterDestroy
     * @method afterDestroy
     * @return {function}
     */
    get afterDestroy() {
      return this._afterDestroy;
    }


    /**
     * Método setter para el hook sequelize beforeBulkCreate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method beforeBulkCreate
     * @param  {function} beforeBulkCreate Función hook a definir para el escenario beforeBulkCreate
     */
    set beforeBulkCreate(beforeBulkCreate) {
      this._beforeBulkCreate = beforeBulkCreate;
    }

    /**
     * Retorna el hook sequelize beforeBulkCreate
     * @method beforeBulkCreate
     * @return {function}
     */
    get beforeBulkCreate() {
      return this._beforeBulkCreate;
    }

    /**
     * Método setter para el hook sequelize beforeBulkUpdate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method beforeBulkUpdate
     * @param  {function} beforeBulkUpdate Función hook a definir para el escenario beforeBulkUpdate
     */
    set beforeBulkUpdate(beforeBulkUpdate) {
      this._beforeBulkUpdate = beforeBulkUpdate;
    }

    /**
     * Retorna el hook sequelize beforeBulkUpdate
     * @method beforeBulkUpdate
     * @return {function}
     */
    get beforeBulkUpdate() {
      return this._beforeBulkUpdate;
    }

    /**
     * Método setter para el hook sequelize beforeBulkDestroy
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method beforeBulkDestroy
     * @param  {function} beforeBulkDestroy Función hook a definir para el escenario beforeBulkDestroy
     */
    set beforeBulkDestroy(beforeBulkUpdate) {
      this._beforeBulkDestroy = beforeBulkUpdate;
    }

    /**
     * Retorna el hook sequelize beforeBulkDestroy
     * @method beforeBulkDestroy
     * @return {function}
     */
    get beforeBulkDestroy() {
      return this._beforeBulkDestroy;
    }

    /**
     * Método setter para el hook sequelize afterBulkCreate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method beforeBulkDestroy
     * @param  {function} afterBulkCreate Función hook a definir para el escenario afterBulkCreate
     */
    set afterBulkCreate(afterBulkCreate) {
      this._afterBulkCreate = afterBulkCreate;
    }

    /**
     * Retorna el hook sequelize afterBulkCreate
     * @method afterBulkCreate
     * @return {function}
     */
    get afterBulkCreate() {
      return this._afterBulkCreate;
    }


    /**
     * Método setter para el hook sequelize afterBulkUpdate
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method afterBulkUpdate
     * @param  {function} afterBulkUpdate Función hook a definir para el escenario afterBulkUpdate
     */
    set afterBulkUpdate(afterBulkUpdate) {
      this._afterBulkUpdate = afterBulkUpdate;
    }

    /**
     * Retorna el hook sequelize afterBulkUpdate
     * @method afterBulkUpdate
     * @return {function}
     */
    get afterBulkUpdate() {
      return this._afterBulkUpdate;
    }

    /**
     * Método setter para el hook sequelize afterBulkDestroy
     * este hook se añadira al modelo sequelize para
     * el escenario del mismo nombre,
     * vea la documentación(http://docs.sequelizejs.com/en/v3/docs/hooks/) para entender los hooks
     *
     * @method afterBulkDestroy
     * @param  {function} afterBulkDestroy Función hook a definir para el escenario afterBulkDestroy
     */
    set afterBulkDestroy(afterBulkDestroy) {
      this._afterBulkDestroy = afterBulkDestroy;
    }
    /**
     * Determines if targetObject is an array
     * @method isArray
     * @param {Mixed} targetObj
     * @return {Boolean}
     */
    isArray (targetObj) {
   		return (targetObj && Object.prototype.toString.call( targetObj ) == '[object Array]');
  	}
    /**
     * Retorna el hook sequelize afterBulkDestroy
     * @method afterBulkDestroy
     * @return {function}
     */
    get afterBulkDestroy() {
      return this._afterBulkDestroy;
    }
    /**
     *
     * @method getPrimaryKey
     * @return {Array}
     */
    getPrimaryKey() {
      let me = this;
      if( !me.primaryKey ) {
        let primaryKeys = [];
        for(let primaryKeyName in me.model.primaryKeys ){
          let primaryKeyAttribute = me.model.primaryKeys[primaryKeyName]
          primaryKeys.push(primaryKeyAttribute.fieldName);
        }

        if( primaryKeys.length == 1 ){
          me.primaryKey = primaryKeys[0];
        } else if( primaryKeys.length > 1 ){
          me.primaryKey = primaryKeys;
        }
      }
      return me.primaryKey;
    }
    /**
     *
     * @method save
     * @param {Object}
     * @return {Promise}
     */
    save(modelData) {
      return new Promise((resolve,reject) => {
        let modelInstance = this.model.build(modelData);
        modelInstance.validate().then((validationError) => {
          if(validationError != null) {
            let error = new CrudException(CrudException.VALIDATION_FAILED,"validation_failed",validationError);
            return reject(error);
          }
          sequelize.transaction((t) => {
            return modelInstance.save({ transaction: t }).then((instance) => {
              let plainInstance = instance.get({ plain : true })
              return resolve(plainInstance)
            });

          }).catch((err) => {
            let error = new CrudException(CrudException.INTERNAL_ERROR,err.message,err);
            return reject(error);
          });
        });
      });
    }
    /**
     *
     * @method findOne
     * @param {Object} searchParams
     * @return Promise
     */
    findOne(searchParams) {
      return new Promise((resolve,reject) => {
        this.model.findOne({ where: searchParams })
        .then((response) => {
          if( response == null ) {
            let error = new CrudException(CrudException.NOT_FOUND,"not_found");
            return reject(error);
          }
          return resolve(response);
        })
        .catch((error) => {
          let exception = new CrudException(CrudException.INTERNAL_ERROR,error.message,error);
          return reject(exception);
        });

      });
    }
    /**
     * @method update
     * @param {Object} instance
     */
    update(searchParams,updateData) {
      return new Promise((resolve,reject) => {
        this.findOne((searchParams)).then((response) => {
          response.updateAttributes(updateData);
          sequelize.transaction((t) => {
            return response.update({transaction: t}).then((instance) => {
              resolve(instance.get({ plain : true }));
            });
          }).catch((err) => {
            return reject(err);
          });

        }).catch((error) => {
            return reject(error);
        });
      });
    }
    /**
     * Destroys an object wich matches the criteria specified by searchParams
     *
     * @method destroy
     * @param {Object} searchParams
     * @return {Promise}
     *
     */
    destroy(searchParams) {
      return new Promise((resolve,reject) => {
        this.findOne(searchParams).then((instance) => {
          if( instance != null ) {
            sequelize.transaction((t) => {
              return instance.destroy({ transaction: t }).then(() => {
                let plainInstance = instance.get({plain : true});
                resolve(plainInstance);
              })
            }).catch((error) => {
              let exception = new CrudException(CrudException.INTERNAL_ERROR,error.message);
              return reject(exception);
            });

          } else {
            let error = new CrudException(CrudException.NOT_FOUND,"not_found");
            return reject(error);
          }

        }).catch((error) => {
          return reject(error);
        });

      });
    }
    /**
     * findAll method uses sequelize's findAndCountAll method to return a paged
     * dataset with an additional property: pagingInfo, a computed Object which
     * contains paging information(next page, previous page, last page, first page)
     *
     * @method findAll
     * @param {Object} options
     * @return {Promise}
     */
    findAll({
      limit = 10,
      offset = 0,
      where = null,
      sortField = null,
      sortOrder = null,
      fields = null
    }) {

      return new Promise((resolve,reject) => {
        let searchOptions = {
          limit: limit,
          offset: offset
        };

        if(this.defaultSortField != null){
          searchOptions["sortField"] = this.defaultSortField;
        }

        if(this.defaultSortOrder != null){
          searchOptions["sortOrder"] = this.defaultSortOrder;
        }

        if( where != null ) {
          searchOptions.where = where;
        }

        if( fields != null ) {
          searchOptions.fields = fields;
        }

        if( sortField != null ) {
          searchOptions.where = where;
        }

        if(sortOrder != null) {
          searchOptions.where = where;
        }

        this.model.findAndCountAll(searchOptions).then((response) => {
          let previous = 0;
          let firstPage = null;
          let total = response.count;
    			let nextOffset = (offset + limit);
    			let totalPages = parseInt(Math.ceil(total / limit));
    			let lastOffset = (totalPages * limit);

          if( offset > 0 ){
    				previous = offset - limit;
    			}

    			firstPage  = { limit: limit, offset: 0 };
    			nextOffset = ( nextOffset <= total ) ? {limit: limit,offset: nextOffset} : null;
    			lastOffset = { limit: limit, offset: lastOffset};
    			previous   = ( offset > 0 ) ? { limit: limit, offset: previous } : null;

          response.pagingInfo = { first: firstPage, next: nextOffset, previous: previous, last: lastOffset };

          return resolve(response);
        }).catch((error) => {
          let exception = new CrudException(CrudException.INTERNAL_ERROR,error.message,error);
          return reject(exception);
        });
      });

    }
    /**
     * @method bulkCreate
     * @param {Array} bulkObjects
     * @return {Promise}
     *
     */
    bulkCreate(bulkObjects) {
      return new Promise((resolve, reject) => {
        if ( this.isArray(bulkObjects)) {
            if ( bulkObjects && bulkObjects.length > 0 ) {
              this.model.bulkCreate(bulkObjects, { validate: true }).then((affectedRows) => {
                return resolve(affectedRows)
              }).catch((errors) => {
                return reject(errors);
              });
            } else {
              let error = new CrudException(CrudException.VALIDATION_FAILED,"empty_bulk_array");
              return reject(error);
            }

        } else {
          let error = new CrudException(CrudException.UNPROCESABLE_ENTITY,"invalid_bulk_array");
          return reject(error);
        }
      });
    }
  }

  return SequelizeModel;
};
