const express = require("express");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log("First middleware");
  console.log(`${req.path} with ${req.method} method`);
  next();
});

app.get("/api/users", (req, res) => {
  console.log("get request");
  res.status(200).json({
    message: "User list",
    data: {
      name: "John Doe",
      age: 25,
    },
  });
});

app.post("/api/users", (req, res) => {
  console.log(req.body);
  res.status(201).json({
    message: "User created",
    data: req.body,
  });
});

app.use(function (req, res) {
  res.status(200).json({
    message: "Hello world",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
