const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      // validate: {
      //   validator: function(){
      //     return this.password === this.confirmPassword
      //   },
      //   message: "Password and confirm password should be same"
      // }
    },
    id: String,
    token:String,
    otpExpiry:Date,
    role:{
      type: String,
      default: "user"
    },
    bookings:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Booking"
    }
  });

  const validRoles = ["admin", "user", "seller"];
  userSchema.pre("save", async function(next){
    // check if password and confirmPassword are same
    console.log("cf", this.confirmPassword)
    console.log("password", this.password)
    if(this.password !== this.confirmPassword){
      next(new Error("Password and confirm password should be same"))
    }
    this.confirmPassword = undefined;
    // use bcrypt to hash password
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    console.log("updated",this.password, hashedPassword)
    // checking for roles
    if(this.role){
      const isValid = validRoles.includes(this.role);
      if(!isValid){
        next(new Error("User can either be admin, user or seller"))
      }else {
        next()
      }

    }else {
      this.role = "user";
      next()
    }

  })
  
  const User = mongoose.model("User", userSchema);

  module.exports = User;
  