"use strict"
const chalk  = require("chalk");
const expect = require("chai").expect;
const should = require("chai").should;
const request = require("superagent");

describe("CrudController class tests",function() {
  let baseUrl = "http://localhost:8000";
  let app = require("./demoServer");
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


  describe("When making an HTTP POST to /persons",function() {
    this.timeout(500);
    it("Should be able to validate errors",function(done){
      request.post(`${baseUrl}/persons`).end(function(err,res) {
          let parsedResponse = JSON.parse(res.text);
          expect(err).to.be.ok;
          expect(res).to.have.property("status",422);//Unprocessable entity
          done();
      });

    });

    it("Should be able to create a person",function(done){
      request.post(`${baseUrl}/persons`).send({
        id: personId,
        name: "Marco",
        last_name: "Villarreal",
        identity_doc:"v-12345662",
        birth_date: new Date(1989,09,11)
      })
      .set("Content-Type","application/json")
      .end(function(error,response) {

          expect(error).to.not.be.ok;
          expect(response).to.have.property("status",201);
          let parsedResponse = JSON.parse(response.text);
          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');

          expect(parsedResponse).to.have.deep.property('data.id');
          expect(parsedResponse).to.have.deep.property('data.name');
          expect(parsedResponse).to.have.deep.property('data.last_name');
          expect(parsedResponse).to.have.deep.property('data.identity_doc');
          expect(parsedResponse).to.have.deep.property('data.birth_date');

          done();
      });

    });

  });

  describe("When making HTTP GET requests to /persons/:id",function(){
      this.timeout(500);
      it("Should be able to find a record",function(done){

        request.get(`${baseUrl}/persons/${personId}`).end(function(error,response){
          expect(error).to.not.be.ok;
          expect(response).to.have.property("status",200);
          let parsedResponse = JSON.parse(response.text);

          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');

          expect(parsedResponse).to.have.deep.property('data.id');
          expect(parsedResponse).to.have.deep.property('data.name');
          expect(parsedResponse).to.have.deep.property('data.last_name');
          expect(parsedResponse).to.have.deep.property('data.identity_doc');
          expect(parsedResponse).to.have.deep.property('data.birth_date');

          done();
        });
      });

      it("Shouldn't be able to find a non registered id",function(done){
        request.get(`${baseUrl}/persons/01298`).end(function(err,res) {
          expect(err).to.be.ok;
          expect(res).to.have.property("status",404);
          let parsedResponse = JSON.parse(res.text);
          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');
          done();
        });
      });

      it("Shouldn't be able to fetch non numeric ids",function(done){
        request.get(`${baseUrl}/persons/NAN`).end(function(err,res) {
          expect(err).to.be.ok;
          done();
        });
      });
  });

  describe("When making HTTP PUT requests to /persons/:id",function(){
    this.timeout(500);
    it("Shouldn't be able to fetch non numeric ids",function(done){
      request.put(`${baseUrl}/persons/NAN`)
      .set("Content-Type","application/json")
      .end(function(err,res) {
        expect(err).to.be.ok;
        done();
      });
    });

    it("Shouldn't be able to update a non registered id",function(done){
      request.put(`${baseUrl}/persons/01298`)
      .set("Content-Type","application/json")
      .end(function(err,res) {
        expect(err).to.be.ok;
        expect(res).to.have.property("status",404);
        let parsedResponse = JSON.parse(res.text);
        expect(parsedResponse).to.have.property('status');
        expect(parsedResponse).to.have.property('statusMessage');
        expect(parsedResponse).to.have.property('message');
        expect(parsedResponse).to.have.property('data');
        done();
      });
    });

    it("Should be able to update a registered id",function(done) {
      request.put(`${baseUrl}/persons/${personId}`).send({
        name: "Marco Antonio",
        last_name: "Villarreal Benites"
      })
      .set("Content-Type","application/json")
      .end(function(error,response) {
          expect(error).to.not.be.ok;
          expect(response).to.have.property("status",200);
          let parsedResponse = JSON.parse(response.text);

          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');

          expect(parsedResponse).to.have.deep.property('data.id');
          expect(parsedResponse).to.have.deep.property('data.name');
          expect(parsedResponse).to.have.deep.property('data.last_name');
          expect(parsedResponse).to.have.deep.property('data.identity_doc');
          expect(parsedResponse).to.have.deep.property('data.birth_date');
          //Validating update :)
          expect(parsedResponse).to.have.deep.property('data.name',"Marco Antonio");
          expect(parsedResponse).to.have.deep.property('data.last_name',"Villarreal Benites");

          done();
      });
    });

    describe("When making a batch post request to /persons/batch",function(){
      this.timeout(500);
      /**
       * Making a request with invalid batch json should result in a 422 Unprocessable entity
       * and a formatted message with fields status, statusMessage, message and data
       * @type {Number}
       */
      it("Should be able to validate a malformed json",function(done){
        request.post(`${baseUrl}/persons/batch`).send({x:1,y:0})
        .set("Content-Type","application/json")
        .end(function(error,response) {
          expect(error).to.be.ok;
          expect(response).to.have.property("status",422);
          let parsedResponse = JSON.parse(response.text);
          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');
          done();
        });

      });

      it("Should be able to validate empty entities",function(done){
        request.post(`${baseUrl}/persons/batch`).send([])
        .set("Content-Type","application/json")
        .end(function(error,response) {
          expect(error).to.be.ok;
          expect(response).to.have.property("status",412);
          let parsedResponse = JSON.parse(response.text);
          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');
          done();
        });
      });

      it("Should be able to validate missing fields on bulk data",function(done){
        request.post(`${baseUrl}/persons/batch`).send(validationPersons)
        .set("Content-Type","application/json")
        .end(function(error,response) {
          expect(error).to.be.ok;
          expect(response).to.have.property("status",500);
          let parsedResponse = JSON.parse(response.text);
          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');
          done();
        });
      });

      it("Should be able to create a list of persons",function(done){
        request.post(`${baseUrl}/persons/batch`).send(persons)
        .set("Content-Type","application/json")
        .end(function(error,response) {
          expect(error).to.not.be.ok;

          expect(response).to.have.property("status",201);
          let parsedResponse = JSON.parse(response.text);

          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');
          expect(parsedResponse).to.have.property('errors');
          expect(parsedResponse.data).to.be.instanceof(Array);
          expect(parsedResponse.data).to.have.lengthOf(10);

          expect(parsedResponse).to.have.deep.property('data[0].id');
          expect(parsedResponse).to.have.deep.property('data[0].name');
          expect(parsedResponse).to.have.deep.property('data[0].last_name');
          expect(parsedResponse).to.have.deep.property('data[0].identity_doc');
          expect(parsedResponse).to.have.deep.property('data[0].birth_date');
          done();

        });
      });
    });

    describe("When making an http request to /persons",function(){
      this.timeout(500);
      it("Should return a list of persons",function(done){
        request.get(`${baseUrl}/persons`).end(function assert(err,res){
          let parsedText = JSON.parse(res.text);
          expect(err).to.not.be.ok;
          expect(res).to.have.property("status",200);

          expect(parsedText).to.have.deep.property("data.count");
          expect(parsedText).to.have.deep.property("data.rows");
          expect(parsedText).to.have.deep.property("data.pagingInfo");
          expect(parsedText.data.rows).to.be.instanceof(Array);
          expect(parsedText.data.rows).to.have.lengthOf(10);

          expect(parsedText).to.have.deep.property('data.rows[0].id');
          expect(parsedText).to.have.deep.property('data.rows[0].name');
          expect(parsedText).to.have.deep.property('data.rows[0].last_name');
          expect(parsedText).to.have.deep.property('data.rows[0].identity_doc');
          expect(parsedText).to.have.deep.property('data.rows[0].birth_date');

          expect(parsedText).to.have.deep.property('data.pagingInfo.next');
          expect(parsedText).to.have.deep.property('data.pagingInfo.first');
          expect(parsedText).to.have.deep.property('data.pagingInfo.previous');
          expect(parsedText).to.have.deep.property('data.pagingInfo.last');
          done();
        })
      });
    });

    describe("When making HTTP DELETE requests to /persons/:id",function(){
      this.timeout(500);
      it("Shouldn't be able to find a non registered id",function(done){
        request.delete(`${baseUrl}/persons/01298`).end(function(err,res) {
          expect(err).to.be.ok;
          expect(res).to.have.property("status",404);
          let parsedResponse = JSON.parse(res.text);
          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');
          expect(parsedResponse).to.have.property('errors');
          done();
        });
      });

      it("Shouldn't be able to fetch non numeric ids",function(done){
        request.delete(`${baseUrl}/persons/NAN`).end(function(err,res) {
          expect(err).to.be.ok;
          done();
        });
      });

      it("Should be able to delete the requested id",function(done){
        request.delete(`${baseUrl}/persons/${personId}`).end(function(err,res) {
          expect(err).to.not.be.ok;
          expect(res).to.have.property("status",202);
          let parsedResponse = JSON.parse(res.text);
          expect(parsedResponse).to.have.property('status');
          expect(parsedResponse).to.have.property('statusMessage');
          expect(parsedResponse).to.have.property('message');
          expect(parsedResponse).to.have.property('data');
          expect(parsedResponse).to.have.property('errors');

          done();
        });
      });

    });

  });
});
