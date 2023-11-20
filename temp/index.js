const express = require("express");

const app = express();
app.use(express.json());

app.get("/api/users", getUserHandler);
function getUserHandler(req, res) {
  console.log("get request");
  res.status(200).json({
    message: "User list",
    data: {
      name: "John Doe",
      age: 25,
    },
  });
}

app.post("/api/users", (req, res) => {
  console.log(req.body);
  res.status(201).json({
    message: "User created",
    data: req.body,
  });
});
