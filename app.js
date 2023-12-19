const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
// const short = require("short-uuid");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const productRouter = require("./router/productRouter");
const authRouter = require("./router/authRouter");
const bookingRouter = require("./router/bookingRouter");
const reviewRouter = require("./router/reviewRouter");
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors())
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/auth",authRouter);
app.use("/api/booking",bookingRouter);
app.use("/api/reviews",reviewRouter);
app.use('/search', function(req,res){
  console.log(req.query)
  res.status(200).json({
    message:"Search successful",
    data:req.query
  })
})


// const fs = require("fs");
// const data = fs.readFileSync("./data.json", "utf8");
// const userData = JSON.parse(data);


/** Database connection */
mongoose.connect(process.env.DB_URL).then((connection) => {
  console.log("DB connected");
}).catch((err) => {
  console.log("DB connection failed", err.message);
})
/** DB connection ends */

app.use(function (req, res) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
