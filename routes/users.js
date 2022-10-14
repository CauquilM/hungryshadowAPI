const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/login", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      // password: req.body.password,
      password: hashedPassword,
    });

    user
      .save()
      .then(() => {
        res.json({ message: "success" });
      })
      .catch((error) => {
        res.json({ message: error });
      });
  } catch (error) {}
});

router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if (!user) {
      res.json({
        status: 401,
        msg: "not found",
      });
    } else {
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          res.send("success");
        } else {
        }
      } catch {
        res.status(401).send("not found");
      }
    }
  });
});

// router.delete("/:postId", async (req, res) => {
//   try {
//     const removedPost = await User.remove({ _id: req.params.postId });
//     res.json({ message: "success" });
//   } catch (error) {
//     res.json({ message: error });
//   }
// });

module.exports = router;
