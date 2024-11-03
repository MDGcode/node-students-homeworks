// app.js
const http = require("http");
const url = require("url");
const querystring = require("querystring");
const sequelize = require("./config");
require("dotenv").config();

// Import routes
const studentRoutes = require("./routes/student");
const homeworkRoutes = require("./routes/homework");

// Import models and set up associations
const Student = require("./models/studentModel");
const Homework = require("./models/homeworkModel");
const StudentHomework = require("./models/studentHomeworkModel");

Student.belongsToMany(Homework, { through: StudentHomework });
Homework.belongsToMany(Student, { through: StudentHomework });

// Initialize Database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync(); // Sync models here
  })
  .then(() => console.log("All models were synchronized successfully."))
  .catch((err) => console.log("Error: " + err));

// Helper function to parse JSON body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
};

// Create the server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
  const method = req.method.toUpperCase();

  // Routing
  try {
    // Students Routes
    if (pathname.startsWith("api/students")) {
      await studentRoutes(req, res, pathname, method);
      return;
    }

    // Homeworks Routes
    if (pathname.startsWith("api/homeworks")) {
      await homeworkRoutes(req, res, pathname, method);
      return;
    }

    // 404 Not Found
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
});

// Start the server
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV === "dev") {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = server;
