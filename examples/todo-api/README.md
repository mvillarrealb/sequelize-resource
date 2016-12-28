sequelize-resource Proof of concept: TODO API
=============================================

The following guide presents a proof of concept of sequelize-resource module showing a simple way
to wrap existing sequelize models into a REST api.

# Setup and dependencies
```shell
  npm install --save express sequelize pg pg-hstore body-parser sequelize-resource
```
The project structure is as follows
```txt
  |
  |--package.json
  |
  |---app.js
  |
  |---/models
  |    |--index.js
  |    |---Task.js
  |
  |---/controllers
  |    |
  |    |---index.js
  |    |---TaskController.js

```

# Developing The model

First you must develop a simple sequelize model, nothing fancy here only sequelize definition

```javascript
/* models/Task.js */
"use strict"

module.exports = (sequelize,DataTypes) => {
  const Task = sequelize.define("task",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    task_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    is_done: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  },{
      schema : "public"
  });

  return Task;
};
```
## Model Loader
After successfully defining the model you must define a db file wich will contain sequelize connection
and the created model Task(This is a common practice in sequelize development).

```javascript
/* models/index.js */

const Sequelize = require("sequelize");
const config    = require("../config/config");
const sequelize = new Sequelize(config.database,config.username,config.password,config);
const db = {
  Task: require("./Task")(sequelize,Sequelize),
  sequelize: sequelize,
  Sequelize: Sequelize
};

module.exports = db;

```


# Developing controller
Then you must create the controller, every controller will receive as a parameter the sequelizeResource
module and db instance, this will make sense in a couple of seconds.
```javascript
/* controllers/TaskController.js */
module.exports = (sequelizeResource,db) => {
  const express = require("express");
  const taskRouter = express.Router();//create the router
  const Task = db.Task;
  const TaskController = sequelizeResource.createController(Task,{
    /*model options*/
  },{
    primaryKeyURL:"/:id([0-9]+)"/*controller options*/
  });

  TaskController.attachController(taskRouter);//Route binding without this there is no magic

  return taskRouter;
}
```
## Controllers Loader
Just like the models we must define a controller index, this index will require sequelize connection(we need sequelize to require sequelize-resource module)
```javascript
/* controllers/index.js */
module.exports = (db)=> {
  //Load sequelize-resource module(in example directory there is a relative path)
  const sequelizeResource = require("sequelize-resource")(db.sequelize,db.Sequelize);
  //require the controller passing sequelize-resource  instance and db object
  const controllers = {
    Task: require("./TaskController")(sequelizeResource,db)
  };
  return controllers;
};


```

#Developing the server

The final step is putting it all together

```javascript

const express = require("express");
const db = require("./models");//load db
const controllers = require("./controllers")(db);//require controllers passing db as reference

const app = express();//create the app
app.use(require("body-parser").json());

for(let controllerName in controllers) {
  let controller = controllers[controllerName];
  controllerName = controllerName.toLowerCase();
  app.use(`/${controllerName}`,controller);//Some fancy way to add the routers
}
//Syncs db(do not try this at production) and launchs the server
db.sequelize.sync({force: true}).then(() => {
  app.listen(8000,function() {
    console.log("Ready to rock on port 8000");
  });
});
```

# Final steps
Once all the steps are complete then is time to ignite the flames

```
node examples/app.js
```

Then you can use postman to test the following routes:

GET /task
POST /task
GET /task/:id
PUT /task/:id
DELETE /task/:id
POST /task/batch

It seems magical but it is not...
