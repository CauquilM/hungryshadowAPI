const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      refreshToken: generateRefreshToken({
        username: req.body.username,
        password: hashedPassword,
      }),
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
          const userData = {
            username: req.body.username,
            password: user.password,
          };

          if (user.refreshToken == "") {
            const newToken = generateRefreshToken(userData);
            User.updateOne(
              { username: req.body.username },
              { refreshToken: newToken },
              function (err) {
                if (err) {
                  res.status(404).send("fail");
                } else {
                  res.status(200).send("succeed");
                }
              }
            );
          }

          if (!user.refreshToken) {
            const newToken = generateRefreshToken(userData);
            User.updateOne(
              { username: req.body.username },
              { refreshToken: newToken },
              function (err) {
                if (err) {
                  res.status(404).send("fail");
                } else {
                  res.status(200).send("succeed");
                }
              }
            );
          }

          try {
            jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log("fail 2");
            const accessToken = generateAccessToken(userData);
            res.json({
              accessToken: accessToken,
            });
          } catch (error) {
            return res.send(error);
          }
        } else {
          res.send("Wrong credentials");
        }
      } catch {
        res.status(401).send("here not found");
      }
    }
  });
});

router.put("/token", (req, res) => {
  User.updateOne(
    { username: req.body.username },
    { refreshToken: "" },
    function (err, result) {
      if (err) {
        res.status(404).send("fail");
      } else {
        res.status(200).send("succeed");
      }
    }
  );
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
