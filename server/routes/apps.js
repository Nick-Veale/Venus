const express = require("express");
const router = express.Router();
const RegApp = require("../models/AppModel");
const User = require("../models/UserModel");

router.post("/register", async (req, res) => {
  console.log(req.body);

  const creator = await User.findOne({ _id: req.body.creator._id });

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

router.post("/removeapp", async (req, res) => {
  console.log("remove-init");
  console.log(req.body);

  const user = await User.updateOne(
    { _id: req.body.userid },
    { $pullAll: { apps: [req.body.appid] } }
  );

  const responseMan = await User.findOne({ _id: req.body.userid });

  res.status(200).send(responseMan);
});

module.exports = router;
