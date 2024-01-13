const jwt = require("jsonwebtoken");
// const config = require("../../../process.env");

module.exports = function (req, res, next) {
  const tokenWithBearer = req.header("Authorization");
  if (!tokenWithBearer)
    return res.status(401).send("Access Denied: No Token Provided!");
  // if (tokenWithBearer !== `Bearer ${process.env.SECRET_KEY}`) {
  //   return res.status(401).end('Unauthorized');
  // }

  const token = tokenWithBearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.token = decoded;
    next();
  } catch (error) {
    res.status(400).send("Access Denied: Invalid Token!");
  }
};
