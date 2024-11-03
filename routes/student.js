// routes/student.js
const url = require("url");
const Student = require("../models/studentModel");
const Homework = require("../models/homeworkModel");

const parseBody = require("../utils/parseBody"); // We'll create this utility

const studentRoutes = async (req, res, pathname, method) => {
  const pathSegments = pathname.split("/").slice(2); // Remove 'api' and 'students'

  // /api/students
  if (pathSegments.length === 0) {
    if (method === "GET") {
      // Get all students
      try {
        const students = await Student.findAll();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(students));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (method === "POST") {
      // Create a new student
      try {
        const body = await parseBody(req);
        const student = await Student.create({
          name: body.name,
          email: body.email,
          specialization: body.specialization,
          year: body.year,
        });
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(student));
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

  // /api/students/:id
  if (pathSegments.length === 1) {
    if (method === "GET") {
      // Get one student
      try {
        const student = await Student.findByPk(id);
        if (!student) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Student not found" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(student));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (method === "PATCH") {
      // Update one student
      try {
        const student = await Student.findByPk(id);
        if (!student) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Student not found" }));
          return;
        }

        const body = await parseBody(req);
        if (body.email != null) student.email = body.email;
        if (body.name != null) student.name = body.name;
        if (body.specialization != null)
          student.specialization = body.specialization;
        if (body.year != null) student.year = body.year;

        const updatedStudent = await student.save();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedStudent));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (method === "DELETE") {
      // Delete one student
      try {
        const student = await Student.findByPk(id);
        if (!student) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Student not found" }));
          return;
        }

        await student.destroy();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Student deleted" }));
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

  // /api/students/:id/homeworks
  if (pathSegments.length === 2 && pathSegments[1] === "homeworks") {
    if (method === "POST") {
      // Assign homework to student
      try {
        const student = await Student.findByPk(id);
        const body = await parseBody(req);
        const homework = await Homework.findByPk(body.homeworkId);

        if (!student || !homework) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Student or Homework not found" }));
          return;
        }

        await student.addHomework(homework, { through: { grade: body.grade } });
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Homework assigned to student" }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (method === "GET") {
      // Get all homeworks assigned to a student
      try {
        const student = await Student.findOne({
          where: { id: id },
          include: Homework,
        });
        if (!student) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Student not found" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(student.Homework));
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

  // /api/students/:studentId/homeworks/:homeworkId
  if (pathSegments.length === 3 && pathSegments[1] === "homeworks") {
    const homeworkId = pathSegments[2];
    if (method === "DELETE") {
      try {
        const { studentId } = { studentId: id };
        // Find the student by ID
        const student = await Student.findByPk(studentId);
        if (!student) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Student not found" }));
          return;
        }

        // Find the homework by ID
        const homework = await Homework.findByPk(homeworkId);
        if (!homework) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Homework not found" }));
          return;
        }

        // Remove the homework from the student's assignments
        await student.removeHomework(homework);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Homework assignment removed from student",
          })
        );
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

module.exports = studentRoutes;
