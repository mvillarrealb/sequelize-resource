const express = require("express");
const db = require("./models");
const controllers = require("./controllers")(db);

const app = express();

for(let controllerName in controllers) {
  let controller = controllers[controllerName];
  controllerName = controllerName.toLowerCase();
  app.use(`/${controllerName}`,controller)
}

db.sequelize.sync({force: true}).then(() => {
  app.listen(8000,function() {
    console.log("Ready to rock on port 8000");
  });
});
