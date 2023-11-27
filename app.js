const express = require("express");
const app = express();
// const short = require("short-uuid");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const productRouter = require("./router/productRouter");
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);


// const fs = require("fs");
// const data = fs.readFileSync("./data.json", "utf8");
// const userData = JSON.parse(data);


/** Database connection */
mongoose.connect(process.env.DB_URL).then((connection) => {
  console.log("DB connected");
}).catch((err) => {
  console.log("DB connection failed");
})
/** DB connection ends */

app.use(function (req, res) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
