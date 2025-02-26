const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const mongoose = require('mongoose');
// const URLDB = process.env.DB_URL;
require('dotenv').config();

const dataCohotrs = require('../data/cohorts.json');
const dataStudents = require("../data/students.json");
const cors = require('cors');

const Cohort = require('./models/Cohort.model')
const Student = require('./models/Student.model')

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
app.use(cors({
  origin: ['http://localhost:5005','http://localhost:3000']
}))
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

app.get("/api/cohorts", (req, res) => {
  res.json(dataCohotrs);
});

app.get("/api/students", (req, res) => {
  res.json(dataStudents);
});

app.post("/api/students",(req,res)=>{
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
    projects: req.body.projects
})
    .then(createStudent =>{
      console.log("Student created ", createStudent);
      res.status(201).json(createStudent);
    })
    .catch(err=>{
      console.error(err, "Error to create student")
      res.status(500).json({error:"Failed to create student"+err})
    })
})


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});