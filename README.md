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

# Middleware(Since version 1.0.1)

Since patch 1.0.1 middleware is enabled to the generated controllers, in the previous version
there wasn't a fancy way to implement middleware on the generated controllers(using attachController),
if you wanted to use middleware you had to define the router routes manually(so long attachController magic).

However It was inmediatly neccesary to use middleware so...lets patch this.

## Middleware Example 101 a basic function

In this example we have a variable called counter wich will be increased each time
a request ends, (after middleware executed) if the counter is greater than
20 in the before middleware then a response will be send with a too many requests
message, this middlewares will be applied to every route of this controller,
so is treated as global middleware, global middleware is useful for handling
stuff like authorization and session handling

```javascript

const express = require("express");
const taskRouter = express.Router();
const Task = db.Task;
let counter = 0;
const TaskController = sequelizeResource.createController(Task,{

},{
  primaryKeyURL:"/:id([0-9]+)",
  middleware: {
    before: function(req,res,next){
      req.counter = counter;
      if( counter > 20){
        return res.send({
          message: "Too many requests",
          requestCount: counter
        })
      } else {
         next();
      }
    },
    after: function(){
      counter++;
      console.log(counter);
    }
  }
});
TaskController.attachController(taskRouter);


```

## Middleware Example 102 a case specific middleware function
In the previous example we used a middleware which executes on every case,
now we will use a middleware for some cases(findAll and findOne), this middleware
will be localized on two cases on the before middleware and will be global
on the after scenario. However it will check if the parameter
scenario exists on the request object(req.scenario) if exists it will and
also exists on visitsCounter object it will increase the counter on the
given case.

```javascript

const express = require("express");
const taskRouter = express.Router();
const Task = db.Task;
let visitsCounter = {
  findOne: 0,
  findAll: 0
}
const TaskController = sequelizeResource.createController(Task,{},{
  primaryKeyURL:"/:id([0-9]+)",
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
    },
    after: function(req,res){
      if(req && req.scenario){
        if(visitsCounter[req.scenario]) {
           visitsCounter[req.scenario] += 1;
        }
      }
    }
  }
});

TaskController.attachController(taskRouter);


```
# Response Interceptor(Since patch 1.0.1)

A new feature called responseSender or response interceptor were added on patch 1.0.1, this is
just like middleware a global function or local object that allow us to catch the response
before being sent to the client and modify it at our will, this is helpful if the response
format provided by sequelize-resource is not suitable for your needs or you need to add
extra field to the response. The response sender works as a middleware function
which receives request(req), response(res), next middleware and the response to be sent.
At this point you can format your response or modify response object.

## Example Change response format using sendResponse global function

In this example we use sendResponse property as a function wich will redefine the response format
provided by default to a new one.

```javascript

const express = require("express");
const taskRouter = express.Router();
const Task = db.Task;
let visitsCounter = {
  findOne: 0,
  findAll: 0
}

const TaskController = sequelizeResource.createController(Task,{},{
  primaryKeyURL:"/:id([0-9]+)",
  sendResponse: (req,res,next,response) => {
    res.status(response.status).send({
      data: response.data,
      counter: visitsCounter
    });
  },
  middleware: {
    findAll: function(req,res,next) {
      req.scenario = "findAll";
      next();
    },
    findOne: function(req,res,next) {
      req.scenario = "findOne";
      next();
    },
    after: function(req,res) {
      if(req && req.scenario){
        if(visitsCounter[req.scenario]) {
          visitsCounter[req.scenario] += 1;
        }
      }
    }
  }
});

TaskController.attachController(taskRouter);

```

## Example change response format only on findAll case(local sender function)
In this case we use an hipotetical async function called getPendingTaskCount,
wich receives a callback as parameter, in this callback we got two params
error(error first callback), and the counter if the error is not null
then an 500 status is sent to the client, otherwise the counter is
appended to data property in the prebuild response and then is sent
to the client, this example is a useful use case, sometimes we will need
to add additional computations to default behaviors and responses.

```javascript

const express = require("express");
const taskRouter = express.Router();
const Task = db.Task;

const TaskController = sequelizeResource.createController(Task,{},{
  primaryKeyURL:"/:id([0-9]+)",
  sendResponse: {
    findAll : (req,res,next,response) => {
      Task.getPendingTaskCount(function(err,counter){
        if(err) {
          return res.status(500).send(err);
        }
        response.data.pending_tasks = counter;
        res.send(response);
      });

    }
  }
});

TaskController.attachController(taskRouter);

```
# Test

This module was developed using a basic TDD approach using mocha and chai, two test are available
in the main test script:

* A test for SequelizeModel's class
* A test for CrudController's class using a dummy REST API(tested with superagent)

To run the main test script just execute the following command in the main module directory

```shell
npm test
```
