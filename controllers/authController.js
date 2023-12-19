const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { sendEmailHelper } = require("../nodemailer");
const User = require("../models/userModel");
const { SECRET_KEY } = process.env;

const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const signupHandler = async function (req, res) {
  try {
    // add it to the db
    const userObject = req.body;
    //   data -> req.body
    let newUser = await UserModel.create(userObject);
    // send a response
    res.status(201).json({
      message: "user created successfully",
      user: newUser,
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      status: "success",
    });
  }
};

const loginHandler = async function (req, res) {
  try {
    let { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
      let areEqual = password == user.password;
      if (areEqual) {
        // user is authenticated
        /* 2. Sending the token -> people remember them
         * */
        // payload : id of that user
        jwt.sign(
          { id: user["_id"] },
          SECRET_KEY,
          { expiresIn: "1h" },
          function (err, data) {
            if (err) {
              throw new Error(err.message);
            }
            res.cookie("token", data, {
              maxAge: 1000 * 60 * 60 * 24 * 7,
              httpOnly: true,
            });
            res
              .status(200)
              .json({ status: "success", message: data, user:{
                name: user.name,
                email: user.email,
                role: user.role
              } });
          }
        );
      } else {
        // console.log("err", err);
        res.status(404).json({
          status: "failure",
          message: "email or password is incorrect",
        });
      }
    } else {
      res.status(404).json({
        status: "failure",
        message: "user not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  // user sends their email
  // verify that the email exists
  // generate a token
  // send the token to the user's email
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: "error",
        data: "User not found",
      });
    } else {
      // generate a token
      const token = otpGenerator();
      user.token = token.toString();
      user.otpExpiry = Date.now() + 1000 * 60 * 60; // 60 minutes
      await user.save();
      sendEmailHelper(token, email)
        .then(() => {
          console.log("Email is sent");
        })
        .catch((err) => {
          console.log(err);
        });
      res.status(200).json({
        message: "success",
        data: "Email is sent",
        id: user._id,
        token: user.token,
      });

      // save the token in the user's document
      // send the token to the user's email
    }
  } catch (err) {
    res.status(500).json({
      message: "error",
      data: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  // user sends their token and new password
  // req has user id in the params
  // verify that the token is valid
  // update the user's password
  try {
    const { token, password, email } = req.body;
    const { userId } = req.params;
    // logic
    /**
     * 1. find the user with the id
     * 2. check if the token is valid
     * 3. check if the token is expired
     * 4. upate the password
     */
    //  const user = await User.findOne({email});
    // convert string id to ObjectId
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "error",
        data: "User not found",
      });
    } else {
      if (user.token !== token) {
        res.status(400).json({
          message: "error",
          data: "Invalid token",
        });
      } else {
        if (user.otpExpiry < Date.now()) {
          res.status(400).json({
            message: "error",
            data: "Token is expired",
          });
        } else {
          user.password = password;
          user.token = null;
          user.otpExpiry = null;
          await user.save();
          res.status(200).json({
            message: "success",
            data: "Password is updated",
          });
        }
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "error",
      data: err.message,
    });
  }
};

const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded) {
      const userId = decoded.id;
      req.userId = userId;
      next();
    }
  } catch (err) {
    res.status(500).json({
      status: "failed to authenticate",
      message: err.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  // check if user is admin
  const userId = req.userId;
  console.log("userId", userId);
  const user = await User.findById(userId);
  if (user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      status: "failed to authenticate",
      message: "You are not authorized to access this route",
    });
  }
};

const isAuthorized = function (allowedRoles) {
  return async function (req, res, next) {
    // check if user is admin
    const userId = req.userId;
    console.log("userId", userId);
    const user = await User.findById(userId);
    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      res.status(401).json({
        status: "faiure",
        message: "You are not authorized to access this route",
      });
    }
  };
};

const logoutHandler = (req, res) => {
    // clear the cookie
    res.clearCookie("token");
    res.status(200).json({
      status: "success",
      message: "User is logged out",
    });
}

module.exports = {
  signupHandler,
  loginHandler,
  forgetPassword,
  resetPassword,
  protectRoute,
  isAdmin,
  isAuthorized,
  logoutHandler
};
