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
