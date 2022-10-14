const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    return res.status(404).json({
      message: "Auth failed",
    });
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
