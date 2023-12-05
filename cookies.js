const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
const payload = 1234;
const SECRET_KEY = "SomeRandomKey@12321";

mongoose
  .connect(process.env.DB_URL)
  .then((connection) => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB connection failed", err.message);
  });

// home
// products
// clearCookie

app.use(cookieParser());
// will add a cookie and send as part of response
app.get("/", (req, res) => {
  res.cookie("pageVisited", "home", {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });
  // res.cookie('pageVisited','home',{maxAge: 10000, httpOnly: true})
  console.log("cookies", req.cookies);

  res.json({ message: "Welcome to the home page" });
});
// will check if the user has already visited or visiting for the first time
app.get("/products", (req, res) => {
  console.log(req.cookies);
  res.cookie("product", "bestseller", {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    path: "/products",
  });

  const { pageVisited } = req.cookies;
  if (pageVisited) {
    res.json({ message: "Welcome to the products page" });
  } else {
    res.json({
      message: "You are visiting for the first time. please sign up / sign in",
    });
  }
});
// clear the cookie
app.get("/clearCookie", (req, res) => {
  try {
    res.clearCookie("product");
    res.clearCookie("pageVisited");
    res.json({ message: "cookie cleared" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.get("/signin", async function (req, res) {
  try {
    jwt.sign(
      { data: payload },
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
        res.json({ message: data });
      }
    );
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.get("/verify", async function (req, res) {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: decoded });
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.post("/signup", async function (req, res) {
  try {
    const userObject = req.body;
    console.log("userObject", userObject);
    const user = await User.create(userObject);
    res.json({ message: "user created successfully", data: user });
  } catch (err) {
    res.json({ message: err.message });
  }
});
app.post("/login", async function (req, res) {
  // validate credentials
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log("user", user);
    if (!user) {
      res.status(400).json({ message: "user not found" });
    } else {
        console.log("user",user,"and password",password)
      if (user.password == password) {
        const token = jwt.sign({ data: user._id }, SECRET_KEY);
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        res.json({ message: "user logged in successfully", data: user });
      } else {
        res.status(400).json({ message: "invalid credentials" });
      }
    }
  } catch (err) {
    res.json({ message: err.message });
  }
  // send token
});
const protectRoute = async function(req, res, next){
    try{
        const { token } = req.cookies;
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("decoded",decoded)
        const user = await User.findById(decoded.data);
        if(!user){
            res.status(400).json({message:"user not found"})
        }else{
            req.user = user;
            next();
        }
    }catch(err){
        res.status(400).json({message:err.message})
    }
}
app.get("/userData", protectRoute, async function (req, res) {
    res.status(200).json({message:"user data", data:req.user})
});

app.get('/logout', function(req,res){
    res.clearCookie('token');
    res.json({message:"user logged out successfully"})
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
