const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");

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

router.post("/signup/admin", async (req, res) => {
  console.log("admin-init");

  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    employeeID: req.body.employeeID,
    type: "Admin",
  });

  console.log(user);

  await user
    .save()
    .then((data) => res.json(data))
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
