const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"].split(' ')[1];
  console.log("token =>",token);
  if (token == null) {
    res.status(401);
    res.send("No token");
    return;
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    console.log(token);
    res.status(401);
    res.send("Token Auth failed");
    return;
  }
}

function generateAccessToken(userData) {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}
function generateRefreshToken(userData) {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
};
