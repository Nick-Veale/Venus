const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  user: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now() },
});

const ticketSchema = mongoose.Schema({
  creator: { type: Object, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  comments: [commentSchema],
  isNew: { type: Boolean, default: true },
  isResolved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Ticket", ticketSchema);
