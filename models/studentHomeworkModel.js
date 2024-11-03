// models/studentHomeworkModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const StudentHomework = sequelize.define("StudentHomework", {
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Remove individual sync
// sequelize.sync()
//   .then(() => console.log('StudentHomework table created'))
//   .catch((err) => console.log('Error: ' + err));

module.exports = StudentHomework;
