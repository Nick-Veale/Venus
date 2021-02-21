// Import Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

//  Import Routes
const userRoute = require("./routes/user");
const ticketRoute = require("./routes/ticket");

// Initialize Apps
const app = express();

// Variables
const port = 3030;

// Middlewares
// app.use(() => console.log("server-init"));
app.use(cors());
app.use(express.json());
app.use("/user", userRoute);
app.use("/ticket", ticketRoute);

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

// Server Ears
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
