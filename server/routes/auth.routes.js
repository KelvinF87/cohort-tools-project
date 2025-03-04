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
  // Validar que se proporcionen email y contraseña
  if (!email || !password) {
    return res.status(400).json({ message: "Proporcione email y contraseña." });
  }
  // Buscar el usuario en la base de datos
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // Usuario no encontrado
        return res.status(401).json({ message: "Usuario no encontrado." });
      }
      // Comparar la contraseña proporcionada con la almacenada
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (!passwordCorrect) {
        return res.status(401).json({ message: "No se pudo autenticar al usuario." });
      }
      // Si la contraseña es correcta, crear el token
      const { _id, email, name } = foundUser;
      const payload = { _id, email, name };
      // Generar el token
      const authToken = jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { algorithm: 'HS256', expiresIn: "6h" }
      );
      // Enviar el token como respuesta
      res.status(200).json({ authToken });
    })
    .catch(err => {
      console.error(err); // Log del error para depuración
      res.status(500).json({ message: "Error interno del servidor." });
    });
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