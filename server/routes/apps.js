const express = require("express");
const router = express.Router();
const RegApp = require("../models/AppModel");
const User = require("../models/UserModel");

router.post("/register", async (req, res) => {
  console.log(req.body);

  const creator = await User.findOne(
    { _id: req.body.creator._id },
    (err, user) => {
      if (err) {
        console.log(`An Error has Occured ${err}`);
        res.status(500).send();
      }
      if (!user) {
        console.log(`User does not exist`);
        res.status(404).send();
      }
      return user;
    }
  );

  const app = new RegApp({
    appName: req.body.appName,
    developers: [creator],
    creator: creator,
  });

  await app.save();

  creator.apps.push(app);

  await creator.save();

  res.status(201).send(creator);
});

router.post("/search", async (req, res) => {
  const data = req.body.data;

  RegApp.find({ appName: new RegExp("^" + data + "$", "i") }, (err, names) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    }
    if (!names) {
      res.status(404).send({ message: "No Results Found" });
    }
    res.status(200).send(names);
  });
});

router.post("/searchid", async (req, res) => {
  const app = await RegApp.findById(req.body.appid);
  res.status(200).send(app);
});

router.post("/adduser", async (req, res) => {
  console.log(req.body);

  const app = await RegApp.findOne({ _id: req.body.app._id });
  const user = await User.findOne({ _id: req.body.user._id });

  user.apps.push(app);
  await user.save();

  res.status(200).send(user);
});

module.exports = router;
