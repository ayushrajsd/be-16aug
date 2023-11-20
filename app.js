const express = require("express");
const app = express();
const short = require("short-uuid");
require("dotenv").config();

const port = process.env.PORT || 3000;
const fs = require("fs");
const data = fs.readFileSync("./data.json", "utf8");
const userData = JSON.parse(data);

app.use(express.json());
app.get("/api/user", (req, res) => {
  try {
    let msg = "";
    if (userData.length === 0) {
      msg = "No data found";
      // throw new Error('No data found')
    } else {
      msg = "Data found";
    }
    res.json({
      status: 200,
      data: userData,
      message: msg,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/api/user", (req, res) => {
  const userInput = req.body;
  const isEmpty = Object.keys(userInput).length === 0;
  if (isEmpty) {
    return res.status(400).json({
      status: 400,
      message: "No data found",
    });
  } else {
    const id = short.generate();
    const userDetails = req.body;
    userDetails.id = id;
    console.log(userDetails);
    userData.push(userDetails);
    // write to file
    fs.writeFile("./data.json", JSON.stringify(userData), (err) => {
      if (err) {
        console.log(err);
      }
    });

    res.json({
      status: 200,
      data: req.body,
      message: `User created with id ${id}`,
    });
  }
});

app.get("/api/user/:id", (req, res) => {
  try {
    const { id } = req.params;
    console.log("64", req.params);
    const user = userData.find((user) => user.id == id);
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
});

// app.use(function (req, res) {
//   res.status(201).send("Hello World");
// });

app.use(function (req, res) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
