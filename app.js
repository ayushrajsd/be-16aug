const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
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
// app.use(cors({ origin: "https://curious-lolly-d8f717.netlify.app/", credentials: true }));
const corsConfig = {
  origin: true,
  credentials: true,
};
// this is allowing all the requests
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})
// app.use(cors())
app.use(limiter);
app.use(mongoSanitize());
app.use(helmet());
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
