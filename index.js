const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
console.log(process.env.PORT);

app.use(function (req, res, next) {
  console.log("inside common middleware");
  next();
});

app.get("/api/user", (req, res) => {
  res.json({
    status: 200,
    data: {
      name: "John Doe",
      age: 25,
    },
  });
});

app.post("/api/user", (req, res) => {
  console.log(req.body);
  res.json({
    status: 200,
    data: req.body,
  });
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
