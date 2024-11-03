// routes/homework.js
const url = require("url");
const Homework = require("../models/homeworkModel");
const Student = require("../models/studentModel");

const parseBody = require("../utils/parseBody"); // We'll create this utility

const homeworkRoutes = async (req, res, pathname, method) => {
  const pathSegments = pathname.split("/").slice(2); // Remove 'api' and 'homeworks'

  // /api/homeworks
  if (pathSegments.length === 0) {
    if (method === "GET") {
      // Get all homeworks
      try {
        const homeworks = await Homework.findAll();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(homeworks));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (method === "POST") {
      // Create a new homework
      try {
        const body = await parseBody(req);
        const homework = await Homework.create({
          title: body.title,
          subject: body.subject,
          description: body.description,
        });
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(homework));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
    return;
  }

  const id = pathSegments[0];

  // /api/homeworks/:id
  if (pathSegments.length === 1) {
    if (method === "GET") {
      // Get one homework
      try {
        const homework = await Homework.findByPk(id);
        if (!homework) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Homework not found" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(homework));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (method === "PATCH") {
      // Update one homework
      try {
        const homework = await Homework.findByPk(id);
        if (!homework) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Homework not found" }));
          return;
        }

        const body = await parseBody(req);
        if (body.title != null) homework.title = body.title;
        if (body.subject != null) homework.subject = body.subject;
        if (body.description != null) homework.description = body.description;

        const updatedHomework = await homework.save();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedHomework));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (method === "DELETE") {
      // Delete one homework
      try {
        const homework = await Homework.findByPk(id);
        if (!homework) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Homework not found" }));
          return;
        }

        await homework.destroy();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Homework deleted" }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
    return;
  }

  // /api/homeworks/:id/students
  if (pathSegments.length === 2 && pathSegments[1] === "students") {
    if (method === "GET") {
      try {
        const homework = await Homework.findByPk(id, { include: Student });
        if (!homework) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Homework not found" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(homework.Students));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
    return;
  }
};

module.exports = homeworkRoutes;
