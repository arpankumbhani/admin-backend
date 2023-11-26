const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({ origin: "*" }));
//load config from env file

require("dotenv").config();
//middleware to parse json request body
app.use(express.json());

//mount the todo  API routes
app.use("/api/auth", require("./routes/user"));

//start server

app.get("/", (req, res) => {
  res.send({
    status: "ok",
  });
});

app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

const port = process.env.PORT || 8080;

app.listen(port, (err, res) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err.message);
  } else {
    console.log("[INFO] Server Running on port:", port);
  }
});

//connect to database
const dbConnect = require("./config/database");
dbConnect();
