const express = require("express");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const userRouter = express.Router();

userRouter.get('/users/:id', isAuthenticated, (req, res, next) => {
    const userId = req.params.id;

    if(req.payload._id !== userId) {
        return res.status(403).json({message:"You are not authorized to access this data"})
    }

    User.findById(userId)
    .then((user) => {
        res.status(200).json(user)
    })
    .catch((err) => {
        res.status(500).json({message: "Internal server error"})
    })
})

module.exports = userRouter;