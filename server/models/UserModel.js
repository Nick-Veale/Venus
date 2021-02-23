const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  isDeveloper: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apps: [{ type: mongoose.Schema.Types.ObjectId, ref: "RegApp" }],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
