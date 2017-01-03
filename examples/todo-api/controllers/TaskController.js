module.exports = (sequelizeResource,db) => {
  const express = require("express");
  const taskRouter = express.Router();
  const Task = db.Task;
  let counter = 0;
  const TaskController = sequelizeResource.createController(Task,{

  },{
    primaryKeyURL:"/:id([0-9]+)",
    sendResponse: {
      findAll: function(req,res,next,response) {
        response.counter = req.counter;
        res.send(response)
      }
    },
    middleware: {
      before: {
        findAll: function(req,res,next) {
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
        findOne: function(req,res,next) {
          next();
        }
      },
      after: {
        findAll: function(){
          counter++;
          console.log(counter);
        }
      }
    }
  });
  TaskController.attachController(taskRouter);
  return taskRouter;
}
