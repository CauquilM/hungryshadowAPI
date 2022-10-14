const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", authenticateToken, (req, res) => {
  const post = new Post({
    portion: req.body.portion,
    comment: req.body.comment,
    person: req.body.person,
    date: req.body.date,
    time: req.body.time,
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

router.delete("/:postId", authenticateToken, async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.json({ message: "success" });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
