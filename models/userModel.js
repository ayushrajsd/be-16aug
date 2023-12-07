const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: String,
    address: String,
    password:{
      type: String,
      required: true,
      minlength: 8
    },
    confirmPassword:{
      type: String,
      validate: {
        validator: function(){
          return this.password === this.confirmPassword
        },
        message: "Password and confirm password should be same"
      }
    },
    id: String,
    token:String,
    otpExpiry:Date
  });

  userSchema.pre("save", function(){
    this.confirmPassword = undefined;
  })
  
  const User = mongoose.model("User", userSchema);

  module.exports = User;
  