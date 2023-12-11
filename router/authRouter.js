const express = require("express");
const authRouter = express.Router();

const { signupHandler, loginHandler,logoutHandler, resetPassword, forgetPassword } = require("../controllers/authController");
const { checkInput } = require('../utils/crudFactory');
/** Routes for user */
authRouter.post("/signup", checkInput, signupHandler);
authRouter.post("/login", checkInput, loginHandler);
// forget and reset password routes
authRouter.patch("/forgetPassword", forgetPassword);
authRouter.patch("/resetPassword/:userId", resetPassword);
authRouter.get("/logout", logoutHandler);

module.exports = authRouter;