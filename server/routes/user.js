const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const RegApp = require("../models/AppModel");

router.post("/signup", async (req, res) => {
  console.log("signup-init");

  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  console.log(user);

  await user
    .save()
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signup/appcheck", async (req, res) => {
  console.log("appcheck-init");

  await RegApp.findOne({ appName: req.body.appName }, (err, App) => {
    if (err) {
      console.log(`An Error Occurred ${err}`);
      res.status(500).send();
    }
    if (!App) {
      console.log(`No App was Found with that Name`);
      res.status(404).send();
    }
    console.log(App);
    res.status(200).send(App);
  });
});

router.post("/signup/developer", async (req, res) => {
  console.log("dev-init");

  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    isDeveloper: true,
  });

  console.log(user);

  await user
    .save()
    .then((data) => res.status(200).json(data).send())
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  await User.findOne(
    { username: username, password: password },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if (!user) {
        return res.status(404).send();
      }
      console.log(user);
      return res.status(200).send(user);
    }
  );
});

module.exports = router;
