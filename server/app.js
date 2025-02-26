const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const mongoose = require("mongoose");
// const URLDB = process.env.DB_URL;
require("dotenv").config();

const dataCohotrs = require("../data/cohorts.json");
const dataStudents = require("../data/students.json");
const cors = require("cors");

const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

//create mongoose connection with DB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err, "Error connecting to MongoDB"));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: ["http://localhost:5005", "http://localhost:3000"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


// ENDPOINT POST NEW STUDENT
app.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects,
  })
    .then((createStudent) => {
      console.log("Student created ", createStudent);
      res.status(201).json(createStudent);
    })
    .catch((err) => {
      console.error(err, "Error to create student");
      res.status(500).json({ error: "Failed to create student" + err });
    });
});

// ENDPOINT GET ALL STUDENTS
app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      console.log("Retrieved students ->", students);

      res.status(200).json(students);
    })
    .catch((err) => {
      console.error(err, "Error to show student");
      res.status(500).json({ error: "Failed to show student" + err });
    });
});

// ENDPOINT GET STUDENTS by COHORT ID
app.get("/api/students/cohort/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Student.find({ cohort: cohortId })
    .then((students) => {
      console.log("Retrieved students ->", students);

      res.status(200).json(students);
    })
    .catch((err) => {
      console.error(err, "Error to show student");
      res.status(500).json({ error: "Failed to show student" + err });
    });
});

// ENDPOINT GET STUDENTS BY ID
app.get("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  Student.findById(studentId)
    .then((students) => {
      console.log("Retrieved students ->", students);

      res.status(200).json(students);
    })
    .catch((err) => {
      console.error(err, "Error to show student");
      res.status(500).json({ error: "Failed to show student" + err });
    });
});

// ENDPOINT TO PUT STUDENTS BY ID
app.put("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      console.log("Retrieved students ->", updatedStudent);

      res.status(204).json(updatedStudent);
    })
    .catch((err) => {
      console.error(err, "Error to show student");
      res.status(500).json({ error: "Failed to show student" + err });
    });
});

//DELETE STUDENT BY ID
app.delete("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  Student.findByIdAndDelete(studentId)
    .then((result) => {
      console.log("Student deleted!");

      res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
    })

    .catch((error) => {
      console.error("Error while deleting the student ->", error);

      res.status(500).json({ error: "Deleting student failed" });
    });
});

// ENDPOINT POST NEW COHORT
app.post("/api/cohorts", (req, res) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
    .then((createCohort) => {
      console.log("Cohort created ", createCohort);
      res.status(201).json(createCohort);
    })
    .catch((err) => {
      console.error(err, "Error to create cohort");
      res.status(500).json({ error: "Failed to create cohort" + err });
    });
});


// ENDPOINT GET ALL COHORT
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved students ->", cohorts);

      res.status(200).json(cohorts);
    })
    .catch((err) => {
      console.error(err, "Error to show cohorts");
      res.status(500).json({ error: "Failed to show cohorts" + err });
    });
});

//ENDPOINT Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Cohort.findById(cohortId)
    .then((cohorts) => {
      console.log("Retrieved cohort ->", cohorts);

      res.status(200).json(cohorts);
    })
    .catch((err) => {
      console.error(err, "Error to show cohort");
      res.status(500).json({ error: "Failed to show cohort" + err });
    });
});


// /api/cohorts/:cohortId
// ENDPOINT UPDATE COHORT BY ID
app.put("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohorts) => {
      console.log("Retrieved cohorts ->", updatedCohorts);

      res.status(204).json(updatedCohorts);
    })
    .catch((err) => {
      console.error(err, "Error to update cohorts");
      res.status(500).json({ error: "Failed to update cohorts" + err });
    });
});


//DELETE COHORT BY ID
app.delete("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Cohort.findByIdAndDelete(cohortId)
    .then((result) => {
      console.log("Cohort deleted!");

      res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
    })

    .catch((error) => {
      console.error("Error while deleting the Cohort ->", error);

      res.status(500).json({ error: "Deleting Cohort failed" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
