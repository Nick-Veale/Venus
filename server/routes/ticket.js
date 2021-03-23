const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const RegApp = require("../models/AppModel");
const Ticket = require("../models/TicketModel");

router.post("/newticket", async (req, res) => {
  const creator = await User.findOne({ _id: req.body.user._id });
  const app = await RegApp.findOne({ _id: req.body.app._id });
  const ticket = new Ticket({
    creatorid: creator,
    creatorname: creator.username,
    app: app,
    title: req.body.title,
    description: req.body.description,
  });
  await ticket.save();
  await RegApp.updateOne(
    { _id: req.body.app._id },
    { $push: { tickets: ticket } }
  );
  const returnObject = await RegApp.findOne({ _id: req.body.app._id });
  res.status(201).send(returnObject);
});

router.post("/mytickets", async (req, res) => {
  ticketList = await Ticket.find({ creatorid: req.body.userid });
  res.status(200).send(ticketList);
});

router.post("/current", async (req, res) => {
  ticketList = await Ticket.find({ app: req.body.appid });
  res.status(200).send(ticketList);
});

router.post("/setrecent", async (req, res) => {
  await Ticket.updateOne({ _id: req.body.ticket }, { $set: { recent: false } });
  const responseObject = await Ticket.findOne({ _id: req.body.ticket });
  res.status(200).send(responseObject);
});

router.post("/addcomment", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userid });
  const comment = {
    userid: user,
    username: user.username,
    description: req.body.description,
    date: Date.now(),
    replies: [],
  };
  await Ticket.updateOne(
    { _id: req.body.ticket },
    { $push: { comments: comment } }
  );
  const responseObject = await Ticket.findOne({ _id: req.body.ticket });
  res.status(200).send(responseObject);
});

router.post("/addreply", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userid });
  const reply = {
    userid: user,
    username: user.username,
    description: req.body.description,
  };
  await Ticket.updateOne(
    { _id: req.body.ticket, "comments._id": req.body.comment },
    { $push: { "comments.$.replies": reply } }
  );
  const responseObject = await Ticket.findOne({ _id: req.body.ticket });
  res.status(200).send(responseObject);
});

router.post("/getcreator", async (req, res) => {
  const user = await User.findOne({ _id: req.body.id });
  res.status(200).send(user);
});

router.post("/resolve", async (req, res) => {
  await Ticket.updateOne(
    { _id: req.body.ticket },
    { isResolved: req.body.bool, recent: false }
  );
  const ticket = await Ticket.findOne({ _id: req.body.ticket });
  res.status(200).send(ticket);
});

router.post("/delete", async (req, res) => {
  try {
    await Ticket.remove({ _id: req.body.ticket }, { justOne: true });
    res.status(200).send({ message: "Your Ticket has been deleted" });
  } catch (error) {
    res.status(500).send({ message: "An error has occured" });
  }
});

module.exports = router;
