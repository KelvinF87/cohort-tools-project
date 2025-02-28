const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const authRouter = express.Router();
const saltRounds = 10;


authRouter.post("/signup", (req, res, next) => {
    const { email, password, name } = req.body;
    if (email.trim() === '' || password === '' || name === '') {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
      }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
    }

    bcrypt.hash(password, saltRounds)
    .then(hashedPassword => {
        return  User.create({ email, password: hashedPassword, name })

    })
    .then((createdUser) => {
        console.log("User created successfully", createdUser);
        res.status(201).json(createdUser);
     })
     .catch((err) => {
        console.log("Error while creating the user", err);
        console.log(err)
        res.status(404).json({ message: "Error while creating the user" });

    })
});

authRouter.post('/login', (req, res, next) => {
  const { email, password } = req.body;
 
  // Check if email or password are provided as empty string 
  if (email === '' || password === '') {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }
 
  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
    
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." })
        return;
      }
 
      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
 
      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;
        
        // Create an object that will be set as the token payload
        const payload = { _id, email, name };
 
        // Create and sign the token
        const authToken = jwt.sign( 
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: 'HS256', expiresIn: "6h" }
        );
 
        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      }
      else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
 
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

authRouter.get("/verify", isAuthenticated, (req,res,next)=>{
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);
 
    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.payload);

    // User.find()
    // .then((user)=> res.status(200).json(user))  
    // .catch((err)=>{
    //     console.log(err,"Error")
    //     res.status(500).json({ message: "Unable to verify the user" })
    // });

});


module.exports = authRouter;