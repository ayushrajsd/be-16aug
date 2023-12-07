const User = require("../models/userModel");
const {
  getAllFactory,
  createFactory,
  getElementByIdFactory,
  checkInput,
  deleteElementByIdFactory,
} = require("../utils/crudFactory");
const { sendEmailHelper } = require("../nodemailer");
const { ObjectId } = require("mongodb");
/** handlers */

const getUser = getAllFactory(User);

const createUser = createFactory(User);

const getUserById = getElementByIdFactory(User);

const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const forgetPassword = async (req, res) => {
  // user sends their email
  // verify that the email exists
  // generate a token
  // send the token to the user's email
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log("user", user)
    if (!user) {
      res.status(404).json({
        message: "error",
        data: "User not found",
      });
    } else {
      // generate a token
      const token = otpGenerator();
      user.token = token.toString();
      user.otpExpiry = Date.now() + 1000*60*60; // 60 minutes
      console.log("ipdated user", user)
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
            token: user.token
        })

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
 try{
   const { token, password, email } = req.body;
   const { userId } = req.params;
   // logic
   /**
    * 1. find the user with the id
    * 2. check if the token is valid
    * 3. check if the token is expired
    * 4. upate the password
    */
   console.log("email", email)
  //  const user = await User.findOne({email});
  // convert string id to ObjectId
  console.log("id", userId)
  const user = await User.findById(userId);
    console.log("user", user)
   if(!user){
     res.status(404).json({
       message: "error",
       data: "User not found",
     });
   }else {
      if(user.token !== token){
        res.status(400).json({
          message: "error",
          data: "Invalid token",
        });
      }else {
        if(user.otpExpiry < Date.now()){
          res.status(400).json({
            message: "error",
            data: "Token is expired",
          });
        }else {
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

 }catch(err){
  res.status(500).json({
    message: "error",
    data: err.message,
  });
 }


  
};

const deleteUserById = deleteElementByIdFactory(User);
module.exports = {
  getUser,
  createUser,
  getUserById,
  checkInput,
  deleteUserById,
  forgetPassword,
  resetPassword,
};
