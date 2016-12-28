sequelize-resource
==================

Convert any sequelize model into a full fledged REST resource, everytime you need
a REST API and use sequelize's ORM, you often find yourself in a boilerplate ocean where every file has to do the same CRUD stuff(always but no always as some people state out).

This module aim to reduce the amount of boilerplate required to create a REST endpoint from a basic sequelize model using two basic abstractions.

* SequelizeModel class: A class that wraps a sequelize model within a fancy promise based api and standarizes responses using a class named CrudException, SequelizeModel api is as follows:

  * __create(modelBody:Object): Promise__ Creates a new sequelize model using build method, performs the validation and then creates the record, if a validation error occurs an exception will be thrown in the promise, you can easily check if a given error is an exception saving the record or if it is a validation error.

  * __update(searchParams:Object,updateParams:Object): Promise__ Updates a sequelize model found from searchParams, using updateParams object if any exception occurs during the operation the promise will be rejected.

  * __findOne(searchParams:Object): Promise__ Finds one sequelize record matching the searchParams object, returns a Promise which will resolve with the record or will reject with any exception thrown

  * __findAll(searchParams:Object):Promise__ Find all the sequelize model records in a paginated fashion using findAndCountAll method, it will return a Promise resolved with the result or rejected by any exception found in the way.

  * __destroy(searchParams:Object):Promise__ Deletes a sequelize model found from searchParams, if any exception occurs during the operation the promise will be rejected.

  * __bulkCreate(bulkObjects:Object):Promise__ Creates a set of sequelize models from a bulk json, returns a Promise resolved when the records are created or rejected when an error occurs.


* CrudController class: A class which uses a SequelizeModel's instance using the same methods described above but used as express router handlers, all the operation previously mentioned can be attached using the method __attachController__ receiving a express.Router.


# Features

sequelize-resource Includes a set of built in features which will make an easy task converting your database models into REST endpoints.

* Endpoint CRUD attachment: Automatic CRUD routes attachment is made using CrudController's attachEndpoints, this attachment is scope safe and controlled by CrudController class

* Model validation upon creating, deleting and updating: Every CRUD endpoint has its own validations such as
  * Validate required fields
  * Validate update on non existent entities
  * Validate delete on non existent entities

* Bulk endpoint to create multiple records: A bulk endpoint is available for every CrudController instance, this endpoint enable bulk creation using sequelize's bulkCreate method.

* JSON based validations: Express middleware is implemented to ensure that every request is working with application/json mime types

* Standard response format for every operation: Every response created by sequelize-resource has an unique response format which makes easier to handle the format is as follows:

```json
 {
   "statusCode":200,/*Http status code*/
   "statusMessage": "Ok",/*Http status message*/
   "message" : "All nice and clean",/*Operation specific message*/
   "data": {/*Response data*/

   },
   "errors": [/*array of errors or null*/

   ]
 }
```

* Pagination, Sorting, field selecting, paging Information: CrudController's findAll method provide a set of cool functionality using sequelize's findAndCountAll method. This method adds support for paging using limit and offset query parameters, also enables sorting and field selecting using query parameters



# Instalation

```shell
npm install --save sequelize-resource
```

# Usage
To use sequelize-resource you need to include the module passing by reference two arguments:
__sequelize__: Sequelize's instance with the connection params
__Sequelize__: Sequelize module

Example:

```javascript
const Sequelize = require("sequelize");
const sequelize = new Sequelize(...);
const sequelizeResource = require("sequelize-resource")(sequelize,Sequelize);
```

You can find a [TODO api](examples/todo-api/README.md) on examples directory with a step by step development guide

# Test

This module was developed using a basic TDD approach using mocha and chai, two test are available
in the main test script:

* A test for SequelizeModel's class
* A test for CrudController's class using a dummy REST API(tested with superagent)

To run the main test script just execute the following command in the main module directory

```shell
npm test
```
