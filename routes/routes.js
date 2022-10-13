const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", (req, res) => {
  const post = new Post({
    portion: req.body.portion,
    comment: req.body.comment,
    person: req.body.person,
    date: req.body.date,
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

router.delete("/:postId", async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.json({ message: "success" });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
