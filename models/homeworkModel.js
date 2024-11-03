// models/homeworkModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Homework = sequelize.define("Homework", {
  subject: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

// Remove individual sync
// sequelize.sync()
//   .then(() => console.log('Homework table created'))
//   .catch((err) => console.log('Error: ' + err));

module.exports = Homework;
