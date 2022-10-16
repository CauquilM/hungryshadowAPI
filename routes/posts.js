const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { authenticateToken } = require("../middleware/auth");

// OK
router.get("/", authenticateToken, async (req, res) => {
  try {
    // works
    const posts = await Post.find();
    console.log(posts);
    res.status(200);
    res.send(posts);
  } catch (err) {
    // probably works
    res.status(403);
    res.send(`Fail to get posts => ${err}`);
  }
});

// OK
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
      // works
      res.status(201);
      res.send("Success to send post");
    })
    .catch((err) => {
      // works
      res.status(403);
      res.send(`Fail to send posts => ${err}`);
    });
});

router.delete("/:postId", authenticateToken, async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.status(200);
    res.send(`Success to delete post`);
  } catch (err) {
    res.status(403);
    res.send(`Fail to delete post => ${err}`);
  }
});

module.exports = router;
