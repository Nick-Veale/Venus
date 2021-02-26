const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  creatorid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creatorname: { type: String, required: true, default: "Anonymous" },
  app: { type: mongoose.Schema.Types.ObjectId, ref: "RegApp" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  comments: [
    {
      userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String, required: true, default: "Anonymous" },
      description: { type: String, required: true },
      date: { type: Date, default: Date.now() },
      replies: [
        {
          userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: { type: String, required: true, default: "Anonymous" },
          description: { type: String, required: true },
          date: { type: Date, default: Date.now() },
        },
      ],
    },
  ],
  recent: { type: Boolean, default: true },
  isResolved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Ticket", ticketSchema);
