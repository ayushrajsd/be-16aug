const express = require("express");
const userRouter = express.Router();
const {getUser, createUser, getUserById, deleteUserById} = require("../controllers/userController");
const {checkInput} = require('../utils/crudFactory');
const {isAdmin, protectRoute} = require("../controllers/authController");
/** Routes for user */
// app.use(checkInput);

// userRouter.get("/", getUser);
userRouter.use(protectRoute);
userRouter.post("/", checkInput, createUser);

userRouter.get('/allUsers', isAdmin, getUser)
userRouter.get("/:id", getUserById);
userRouter.delete('/:id',deleteUserById);

module.exports = userRouter;