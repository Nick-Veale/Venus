const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({
  appName: { type: String, required: true, unique: true },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  developers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  creator: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
});

module.exports = mongoose.model("RegApp", AppSchema);
