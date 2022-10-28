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
router.post("/register", (req, res) => {
  console.log("test");
  User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  })
    .then(async (user) => {
      if (user) {
        console.log("test2");
        res.status(403);
        res.send("Username or email already taken");
      } else {
        try {
          console.log("3");
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          console.log("4");
          const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            refreshToken: generateRefreshToken({
              username: req.body.username,
              password: req.body.password,
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
      }
    })
    .catch((err) => {
      res.status(401);
      res.send(`Not acceptable => ${err}`);
    });
});

// OK
router.post("/login", (req, res) => {
  console.log("test 1");
  User.findOne({ username: req.body.username })
    .then(async (user) => {
      if (!user) {
        res.status(403);
        res.send("User not found", req);
      } else {
        try {
          if (await bcrypt.compare(req.body.password, user.password)) {
            await bcrypt.compare(req.body.password, user.password);
            console.log("compare", user.password);
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
            try {
              jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET);
              const accessToken = generateAccessToken(userData);
              res.status(200);
              res.send({ accessToken: accessToken });
            } catch (err) {
              res.status(200);
              res.send("Success to verify", err);
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
    })
    .catch(() => {
      res.status(401);
      res.send(`Not acceptable => ${req}`);
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
