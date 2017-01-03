"use strict"
const chalk  = require("chalk");
const expect = require("chai").expect;
const should = require("chai").should;
const request = require("superagent");
const internalApiTest = require("./internalApiTester")();

describe("CrudController class tests",function() {
  let baseUrl = "http://localhost:8000";
  let app = require("./demoServer/demoServerMiddleware");
  let port = 8000;
  let personId = 9999;
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
    { name : "Erina",last_name: "Kiesler Klevar",identity_doc:"12345671",birth_date: new Date() }
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

  before(function(done){
    console.log(chalk.blue("Starting mock test server"));
    app.dbSync().then(() => {
        app.start(port,done);
    }).catch((error) => {
      console.error(chalk.red("Could not synchronize db"));
      console.log(error);
    })

  });

  after(function(done){
    console.log(chalk.blue("Stopping mock test server"));
    app.stop(done);
  });

  internalApiTest({
    baseUrl: baseUrl,
    endPoint: "/persons",
    elementId: personId,
    mockId: "050102",
    badId: "NAN",
    pkPattern:":id([0-9]+)",
    postData: {
      id: personId,
      name: "Marco",
      last_name: "Villarreal",
      identity_doc:"v-12345662",
      birth_date: new Date(1989,09,11)
    },
    putData : {
      name: "Marco Antonio",
      last_name: "Villarreal Benites"
    },
    bulkErrorData: validationPersons,
    bulkData: persons,
    assert: {
      findOne: function(err,response,parsedResponse) {

        expect(parsedResponse).to.have.property('page_visits');
        expect(parsedResponse).to.have.property('scenario',"findOne");
        expect(parsedResponse).to.have.deep.property('data.id');
        expect(parsedResponse).to.have.deep.property('data.name');
        expect(parsedResponse).to.have.deep.property('data.last_name');
        expect(parsedResponse).to.have.deep.property('data.identity_doc');
        expect(parsedResponse).to.have.deep.property('data.birth_date');

      },
      findAll: function(err,response,parsedResponse){
        expect(parsedResponse).to.have.property('page_visits');
        expect(parsedResponse).to.have.property('scenario',"findAll");
        expect(parsedResponse).to.have.deep.property('data.rows[0].id');
        expect(parsedResponse).to.have.deep.property('data.rows[0].name');
        expect(parsedResponse).to.have.deep.property('data.rows[0].last_name');
        expect(parsedResponse).to.have.deep.property('data.rows[0].identity_doc');
        expect(parsedResponse).to.have.deep.property('data.rows[0].birth_date');

      },
      bulkCreate: function(err,response,parsedResponse){
        expect(parsedResponse).to.have.property('page_visits');
        expect(parsedResponse).to.have.property('scenario',"bulkCreate");

        expect(parsedResponse).to.have.deep.property('data[0].id');
        expect(parsedResponse).to.have.deep.property('data[0].name');
        expect(parsedResponse).to.have.deep.property('data[0].last_name');
        expect(parsedResponse).to.have.deep.property('data[0].identity_doc');
        expect(parsedResponse).to.have.deep.property('data[0].birth_date');

      },
      create: function(err,response,parsedResponse) {
        expect(parsedResponse).to.have.property('page_visits');
        expect(parsedResponse).to.have.property('scenario',"create");

        expect(parsedResponse).to.have.deep.property('data.id');
        expect(parsedResponse).to.have.deep.property('data.name');
        expect(parsedResponse).to.have.deep.property('data.last_name');
        expect(parsedResponse).to.have.deep.property('data.identity_doc');
        expect(parsedResponse).to.have.deep.property('data.birth_date');
      },
      update: function(err,response,parsedResponse) {
        expect(parsedResponse).to.have.property('page_visits');
        expect(parsedResponse).to.have.property('scenario',"update");

        expect(parsedResponse).to.have.deep.property('data.id');
        expect(parsedResponse).to.have.deep.property('data.name');
        expect(parsedResponse).to.have.deep.property('data.last_name');
        expect(parsedResponse).to.have.deep.property('data.identity_doc');
        expect(parsedResponse).to.have.deep.property('data.birth_date');
        //Validating update :)
        expect(parsedResponse).to.have.deep.property('data.name',"Marco Antonio");
        expect(parsedResponse).to.have.deep.property('data.last_name',"Villarreal Benites");
      },
      destroy: function(err,response,parsedResponse){
        expect(parsedResponse).to.have.property('page_visits');
        expect(parsedResponse).to.have.property('scenario',"destroy");

        expect(parsedResponse).to.have.deep.property('data.id');
        expect(parsedResponse).to.have.deep.property('data.name');
        expect(parsedResponse).to.have.deep.property('data.last_name');
        expect(parsedResponse).to.have.deep.property('data.identity_doc');
        expect(parsedResponse).to.have.deep.property('data.birth_date');
      }
    }
  });

});
