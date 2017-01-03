"use strict"
const chalk  = require("chalk");
const expect    = require("chai").expect;
const db        = require("./config/db");
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const model     = db.person;

describe("sequelize Model test",function(){
  before(function(done){
    console.log(chalk.blue("Starting mock test server"));
    db.sequelize.sync({force: true}).then(() => {
      return done();
    })
    .catch((error) => {
      console.error(chalk.red("Could not synchronize db"));
      console.log(error);
      process.exit();
    })

  });

  const SequelizeModel = require("../lib/SequelizeModel")(sequelize,Sequelize,{});

  let resource = new SequelizeModel(model,{
    beforeCreate: function(instance,options) {
      instance.address = "Home by hook";
      return instance;
    },
    beforeUpdate: function(instance,options) {
      instance.address += " has been updated";
      return instance;
    },
    beforeDestroy: function (instance,options){
      return instance;
    }
  });

  describe("Initializating model",function(){

    it("Should have sequelize model instance",function(){
      expect(resource).to.have.property("model",model);
    })
    it("Should have have Hook beforeCreate",function(){
      expect(resource.beforeCreate).to.be.an("function");
    });

    it("Should have have Hook beforeUpdate",function(){
      expect(resource.beforeUpdate).to.be.an("function");
    });

    it("Should have have Hook beforeDestroy",function(){
      expect(resource.beforeDestroy).to.be.an("function");
    });

    it("Shouldn't have have Hook afterDestroy",function(){
      expect(resource.afterDestroy).to.be.an("undefined");
    });

  });

  describe("Basic CRUD operations",function(){
    it("Should create a person",function(done){
      this.timeout(1000);
      let creationDate = new Date(1989,8,11);
      resource.save({
        name : "Marco",
        last_name: "Villarreal",
        identity_doc:"12345662",
        birth_date: creationDate
      }).then((response) => {
        expect(response).to.have.property("id");
        expect(response).to.have.property("name","Marco");
        expect(response).to.have.property("last_name","Villarreal");
        expect(response).to.have.property("identity_doc","12345662");
        expect(response).to.have.property("address","Home by hook");
        return done();
      }).catch((error) => {
        expect(error).to.not.be.an("object");
        return done();
      });
    });

    it("Should find and update a person",function(done) {
      this.timeout(1000);
      let searchParams = { identity_doc: "12345662" };
      resource.findOne(searchParams).then((person) => {
        expect(person).to.have.property("id");
        expect(person).to.have.property("identity_doc","12345662");

        person.updateAttributes({
          name: "Marco Antonio",
          last_name : "Villarreal Benites"
        });

        resource.update(person).then((updatedPerson) => {
          expect(updatedPerson).to.have.property("name","Marco Antonio");
          expect(updatedPerson).to.have.property("last_name","Villarreal Benites");
          return done();
        }).catch((error) => {
          expect(error).to.not.be.an("object");
          return done();
        });

      }).catch((error) => {
        expect(error).to.not.be.an("object");
        return done();
      });
    });

    it("Should find and delete a person",function(done){
      this.timeout(1000);
      let searchParams = { identity_doc: "12345662" };
      resource.destroy(searchParams).then((deletedResource) => {
        expect(deletedResource).to.have.property("id");
        expect(deletedResource).to.have.property("identity_doc","12345662");
        return done();
      }).catch((error) => {
        expect(error).to.not.be.an("object");
        return done();
      });

    });

  });

  describe("Basic bulk operations",function(){
    let persons = [
      { name : "Marco",last_name: "Villarreal",identity_doc:"12345662",birth_date: new Date() },
      { name : "Jesús",last_name: "Villarreal",identity_doc:"12345663",birth_date: new Date() },
      { name : "Lorenzo",last_name: "Villarreal",identity_doc:"12345664",birth_date: new Date() },
      { name : "Lenin",last_name: "Villarreal",identity_doc:"12345665",birth_date: new Date() },
      { name : "Sebastian",last_name: "Villarreal",identity_doc:"12345666",birth_date: new Date() },
      { name : "Alejandro",last_name: "Villarreal",identity_doc:"12345667",birth_date: new Date() },
      { name : "Angelina",last_name: "Villarreal",identity_doc:"12345668",birth_date: new Date() },
      { name : "Antonio",last_name: "Villarreal",identity_doc:"12345669",birth_date: new Date() },
      { name : "Erick",last_name: "Kiesler Klevar",identity_doc:"12345670",birth_date: new Date() },
      { name : "Erina",last_name: "Kiesler Klevar",identity_doc:"12345671",birth_date: new Date() },
    ];

    let validationPersons = [
      { name : "Marco",last_name: "Villarreal",identity_doc:"1",birth_date: new Date() },
      { name : "Jesús",last_name: "Villarreal",identity_doc:"2",birth_date: new Date() },
      { name : "Lorenzo",last_name: "Villarreal",identity_doc:"3",birth_date: new Date() },
      { name : "Lenin",last_name: "Villarreal",identity_doc:"4",birth_date: new Date() },
      { name : "Sebastian",last_name: "Villarreal",identity_doc:"5",birth_date: new Date() },
      { name : "Alejandro",birth_date: new Date() },
      { last_name: "Villarreal",identity_doc:"7",birth_date: new Date() },
    ];

    it("Should be able to create 10 persons",function(done){
      this.timeout(1000);
      resource.bulkCreate(persons).then((createdPersons) => {
        expect(createdPersons).to.be.instanceof(Array);
        expect(createdPersons).to.have.lengthOf(10);
        done();
      }).catch((error) => {
        expect(error).to.not.be.an("object");
        return done();
      });
    });

    it("Should be able to validate 2 records",function(done){
      this.timeout(1000);
      resource.bulkCreate(validationPersons).then((bulkData) => {
        //this will never happen
        expect(bulkData).to.be.instanceof(Array);
        expect(bulkData).to.have.lengthOf(5);
        done();
      }).catch((validationError) => {
        expect(validationError).to.be.instanceof(Array);
        expect(validationError).to.have.lengthOf(2);
        return done();
      });
    });

    it("Should be able to find 5 records and then delete them",function(done) {
      this.timeout(1000);
      resource.findAll({
        where: {
          identity_doc: {
            $in: ["12345662","12345663","12345664","12345665","12345666"]
          }
        }
      }).then((response) => {
        //Validating response structure
        expect(response).to.be.instanceof(Object);
        expect(response).to.have.property("rows");
        expect(response).to.have.property("count");
        expect(response).to.have.property("pagingInfo");
        //Validating response schema
        expect(response.rows).to.be.instanceof(Array);
        expect(response.pagingInfo).to.be.instanceof(Object);
        expect(response.count).not.to.be.NaN;
        //Validating rows schema
        expect(response).to.have.deep.property('rows[0].name');
        expect(response).to.have.deep.property('rows[0].last_name');
        expect(response).to.have.deep.property('rows[0].identity_doc');
        expect(response).to.have.deep.property('rows[0].birth_date');
        done();

      }).catch((error) => {

        expect(error).to.not.be.an("object");
        return done();
      });

    });
  })

});
