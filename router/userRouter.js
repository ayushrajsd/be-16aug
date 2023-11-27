const express = require("express");
const userRouter = express.Router();
const {getUser, createUser, getUserById, deleteUserById} = require("../controllers/userController");
const {checkInput} = require('../utils/crudFactory');
/** Routes for user */
// app.use(checkInput);

userRouter.get("/", getUser);
userRouter.post("/", checkInput, createUser);
userRouter.get("/:id", getUserById);
userRouter.delete('/:id',deleteUserById);

module.exports = userRouter;