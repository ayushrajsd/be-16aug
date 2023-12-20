const mongoose = require("mongoose");
require("dotenv").config();
/** Database connection */
console.log(process.env)
mongoose.connect(process.env.DB_URL).then((connection) => {
    console.log("DB connected");
  }).catch((err) => {
    console.log("DB connection failed", err.message);
  })
  /** DB connection ends */