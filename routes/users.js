const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/login", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/register", (req, res) => {
  const post = new User({
    username: req.body.username,
    password: req.body.password,
  });

  post
    .save()
    .then(() => {
      res.json({ message: "success" });
    })
    .catch((error) => {
      res.json({ message: error });
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
