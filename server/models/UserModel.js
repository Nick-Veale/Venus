const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true, default: "User" },
  date: { type: Date, default: Date.now },
  isLoggedIn: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", UserSchema);
