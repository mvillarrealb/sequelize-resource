module.exports = (sequelizeResource,db) => {
  const express = require("express");
  const taskRouter = express.Router();
  const Task = db.Task;
  const TaskController = sequelizeResource.createController(Task,{

  },{
    primaryKeyURL:"/:id([0-9]+)"
  });
  TaskController.attachController(taskRouter);
  return taskRouter;
}
