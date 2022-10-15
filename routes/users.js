const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
} = require("../middleware/auth");

// OK
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
        res.status(201);
        res.send("User created");
      })
      // works
      .catch((err) => {
        res.status(403);
        res.send(`One of the required credientials is missing => ${err}`);
      });
    // works
  } catch (err) {
    res.status(403);
    res.send("Empty body, misses all credentials required");
  }
});

// OK
router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) {
      res.status(401);
      res.send(`Not acceptable => ${err}`);
      return;
    }
    if (!user) {
      res.status(403);
      res.send("User not found");
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
                  res.status(403);
                  res.send(`Fail to update => ${err}`);
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
                  res.status(403);
                  res.send(`Fail to update => ${err}`);
                }
              }
            );
          }

          // There's a weird bug, the jwt func is called before the two func above
          // and then it says it's impossible to get a token but a new one is created
          try {
            jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = generateAccessToken(userData);
            res.status(200);
            res.send(`Success to verify => ${accessToken}`);
          } catch (err) {
            res.status(200);
            res.send("Success to verify");
          }
          // works
        } else {
          res.status(403);
          res.send("Wrong credentials");
        }
        // works
      } catch {
        res.status(403);
        res.send(`One of the required credientials is missing => ${err}`);
      }
    }
  });
});

// OK
router.put("/token", authenticateToken, (req, res) => {
  User.updateOne(
    { username: req.body.username },
    { refreshToken: "" },
    function (err, result) {
      if (err) {
        // probably works
        res.status(403);
        res.send("Fail to update user token");
      } else {
        // works
        res.status(200).send("Success to update user token");
      }
    }
  );
});

module.exports = router;
