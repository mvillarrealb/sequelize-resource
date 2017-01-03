"use strict"

module.exports = () => {
  const chalk  = require("chalk");
  const expect = require("chai").expect;
  const should = require("chai").should;
  const request = require("superagent");
  /**
   * internalApiTester is a function which will return a generic
   * test case setup to make TDD over sequelize-resource based
   * apis you  pass a suite options and got a full fledged
   * test case for your sequelize-resource API
   *
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  const internalApiTests = (options) => {
    const baseUrl = options.baseUrl;
    const endPoint = options.endPoint;
    const sleep = require('sleep');

    describe(`When making an HTTP CRUD to ${endPoint}`,function() {

        it("Should be able to validate errors",function(done){
          //console.log(chalk.blue("Beginning HTTP METHOD POST TEST case"));
          request.post(`${baseUrl}${endPoint}`).end(function(err,res) {
              let parsedResponse = JSON.parse(res.text);
              expect(err).to.be.ok;
              expect(res).to.have.property("status",422);//Unprocessable entity
              done();
          });

        });

        it("Should be able to create element",function(done){
          request.post(`${baseUrl}${endPoint}`).send(options.postData)
          .set("Content-Type","application/json")
          .end(function(error,response) {
            if(error){
              console.log(response.text);
            }
              expect(error).to.not.be.ok;
              expect(response).to.have.property("status",201);
              let parsedResponse = JSON.parse(response.text);
              expect(parsedResponse).to.have.property('status');
              expect(parsedResponse).to.have.property('statusMessage');
              expect(parsedResponse).to.have.property('message');
              expect(parsedResponse).to.have.property('data');
              options.assert.create(error,response,parsedResponse);
              done();
          });
        });


        it("Shouldn't be able to find a non registered id",function(done){
          //console.log(chalk.blue("Beginning HTTP METHOD GET TEST case"));
          request.get(`${baseUrl}${endPoint}/${options.mockId}`).end(function(err,res) {
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
          request.get(`${baseUrl}${endPoint}/${options.badId}`).end(function(err,res) {
            expect(err).to.be.ok;
            done();
          });
        });

        it("Shouldn't be able to fetch non numeric ids",function(done){
          request.put(`${baseUrl}${endPoint}/${options.badId}`)
          .set("Content-Type","application/json")
          .end(function(err,res) {
            expect(err).to.be.ok;
            done();
          });
        });

        it(`Should be able to find ${baseUrl}${endPoint}/${options.elementId}`,function(done){
          request.get(`${baseUrl}${endPoint}/${options.elementId}`).end(function(error,response){
            if(error){
              console.log(response.text);
            }
            expect(error).to.not.be.ok;
            expect(response).to.have.property("status",200);
            let parsedResponse = JSON.parse(response.text);

            expect(parsedResponse).to.have.property('status');
            expect(parsedResponse).to.have.property('statusMessage');
            expect(parsedResponse).to.have.property('message');
            expect(parsedResponse).to.have.property('data');
            options.assert.findOne(error,response,parsedResponse);
            done();
          });
        });

        it("Shouldn't be able to update a non registered id",function(done){
          //console.log(chalk.blue("Beginning HTTP METHOD PUT TEST case"));
          request.put(`${baseUrl}${endPoint}/${options.mockId}`)
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
          request.put(`${baseUrl}${endPoint}/${options.elementId}`).send(options.putData)
          .set("Content-Type","application/json")
          .end(function(error,response) {
              expect(error).to.not.be.ok;
              expect(response).to.have.property("status",200);
              let parsedResponse = JSON.parse(response.text);

              expect(parsedResponse).to.have.property('status');
              expect(parsedResponse).to.have.property('statusMessage');
              expect(parsedResponse).to.have.property('message');
              expect(parsedResponse).to.have.property('data');

              options.assert.update(error,response,parsedResponse);
              done();
          });
        });


        it("Shouldn't be able to find a non registered id",function(done){
          //console.log(chalk.blue("Beginning HTTP METHOD DELETE TEST case"));
          request.delete(`${baseUrl}${endPoint}/${options.mockId}`).end(function(err,res) {
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
          request.delete(`${baseUrl}${endPoint}/${options.badId}`).end(function(err,res) {
            expect(err).to.be.ok;
            done();
          });
        });

        it("Should be able to delete the requested id",function(done){
          request.delete(`${baseUrl}${endPoint}/${options.elementId}`).end(function(err,res) {
            if(err){
              console.log(res.text);
            }
            expect(err).to.not.be.ok;
            expect(res).to.have.property("status",202);
            let parsedResponse = JSON.parse(res.text);
            expect(parsedResponse).to.have.property('status');
            expect(parsedResponse).to.have.property('statusMessage');
            expect(parsedResponse).to.have.property('message');
            expect(parsedResponse).to.have.property('data');
            expect(parsedResponse).to.have.property('errors');
            options.assert.destroy(err,res,parsedResponse);
            done();
          });
        });


        //Making a request with invalid batch json should result in a 422 Unprocessable entity
        //and a formatted message with fields status, statusMessage, message and data
        it("Should be able to validate a malformed json",function(done){
          request.post(`${baseUrl}${endPoint}/batch`).send({x:1,y:0})
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
          request.post(`${baseUrl}${endPoint}/batch`).send([])
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
          request.post(`${baseUrl}${endPoint}/batch`).send(options.bulkErrorData)
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

        it("Should be able to create a list of created entities",function(done){

          request.post(`${baseUrl}${endPoint}/batch`).send(options.bulkData)
          .set("Content-Type","application/json")
          .end(function(error,response) {
            if(error){
              console.log(response.text);
            }
            expect(error).to.not.be.ok;

            expect(response).to.have.property("status",201);
            let parsedResponse = JSON.parse(response.text);

            expect(parsedResponse).to.have.property('status');
            expect(parsedResponse).to.have.property('statusMessage');
            expect(parsedResponse).to.have.property('message');
            expect(parsedResponse).to.have.property('data');
            expect(parsedResponse).to.have.property('errors');
            expect(parsedResponse.data).to.be.instanceof(Array);
            expect(parsedResponse.data).to.have.lengthOf(options.bulkData.length);

            options.assert.bulkCreate(error,response,parsedResponse);
            done();

          });
        });


        it("Should return a list of entities",function(done){
          request.get(`${baseUrl}${endPoint}`).end(function assert(err,res){
            let parsedText = JSON.parse(res.text);
            expect(err).to.not.be.ok;
            expect(res).to.have.property("status",200);

            expect(parsedText).to.have.deep.property("data.count");
            expect(parsedText).to.have.deep.property("data.rows");
            expect(parsedText).to.have.deep.property("data.pagingInfo");
            expect(parsedText.data.rows).to.be.instanceof(Array);
            expect(parsedText.data.rows).to.have.lengthOf(options.bulkData.length);
            options.assert.findAll(err,res,parsedText);
            expect(parsedText).to.have.deep.property('data.pagingInfo.next');
            expect(parsedText).to.have.deep.property('data.pagingInfo.first');
            expect(parsedText).to.have.deep.property('data.pagingInfo.previous');
            expect(parsedText).to.have.deep.property('data.pagingInfo.last');
            done();
          })
        });
      });

  };

  return internalApiTests;
};
