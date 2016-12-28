"use strict"

module.exports = (sequelize,Sequelize) => {
  const CrudController = require("./CrudController");
  const SequelizeModel = require("./SequelizeModel")(sequelize,Sequelize);

  return {
    /**
     * CrudController class wrapped export
     * @property CrudController
     * @type {CrudController}
     */
    CrudController: CrudController,
    /**
     * SequelizeModel class wrapped export
     * @property SequelizeModel
     * @type {SequelizeModel}
     */
    SequelizeModel: SequelizeModel,
    /**
     * Creates a CrudController based on a sequelize model, it wraps
     * the model over a SequelizeModel instance and return the new CrudController,
     * optionally you can specify the modelOptions and controllerOptions
     *
     * @method createController
     * @param  {SequelizeModel} model Sequelize model to wrap as a CrudController
     * @param  {Object} modelOpts Model options, accept any valid SequelizeModel.construct options
     * @param  {Object} controllerOpts Controller options, accept any valid CrudController.contruct options
     * @return {CrudController}
     */
    createController: (model,modelOpts = {} ,controllerOpts = {} ) => {
      let sequelizeModel = new SequelizeModel(model,modelOpts);
      return new CrudController(sequelizeModel,controllerOpts);
    }
  };
};
