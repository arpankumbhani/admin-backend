const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({ origin: "*" }));
//load config from env file

require("dotenv").config();
const PORT = process.env.PORT || 6000;

//middleware to parse json request body
app.use(express.json());

//mount the todo  API routes
app.use("/api/auth", require("./routes/user"));

//start server
app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});

//connect to database
const dbConnect = require("./config/database");
dbConnect();

//default routes
app.get("/", (req, res) => {
  res.send(`<h1> This is chalange </h1>`);
});
