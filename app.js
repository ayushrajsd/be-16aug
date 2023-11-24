const express = require("express");
const app = express();
// const short = require("short-uuid");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 3000;


// const fs = require("fs");
// const data = fs.readFileSync("./data.json", "utf8");
// const userData = JSON.parse(data);

app.use(express.json());

/** Database connection */
mongoose.connect(process.env.DB_URL).then((connection) => {
  console.log("DB connected");
}).catch((err) => {
  console.log("DB connection failed");
})
/** DB connection ends */
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
    required: true,
    validate: {
      validator: function(){
        return this.password === this.confirmPassword
      },
      message: "Password and confirm password should be same"
    }
  },
  id: String,
});

const User = mongoose.model("User", userSchema);

/** Routes */
app.get("/api/user", getUser);
app.post("/api/user", createUser);
app.get("/api/user/:id", getUserById);

/** handlers */

async function getUser(req, res) {
  try {
    const userData = await User.find();
    if(userData.length === 0){
      throw new Error("No user found")
    } else {
      res.status(200).json({
        message: userData,
      });
    }
    
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function createUser(req, res){
  try{
    const userDetails = req.body;
    const user = await User.create(userDetails);
    res.status(201).json({
      message: "User created successfully",
      data: user
    })
  }catch(err){
    res.status(500).json({
      message: err.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    console.log("64", req.params);
    const user = await User.findById(id);
    console.log("user", user);
    if (user == undefined) {
      throw new Error("User not found");
    } else {
      return res.status(200).json({
        message: user,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// app.use(function (req, res) {
//   res.status(201).send("Hello World");
// });

app.use(function (req, res) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
