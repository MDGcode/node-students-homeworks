// models/studentModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Student = sequelize.define("Student", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Remove individual sync
// sequelize.sync()
//   .then(() => console.log('Student table created'))
//   .catch((err) => console.log('Error: ' + err));

module.exports = Student;
