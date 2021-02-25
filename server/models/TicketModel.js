const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  app: { type: mongoose.Schema.Types.ObjectId, ref: "RegApp" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      description: { type: String, required: true },
      date: { type: Date, default: Date.now() },
      replies: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
