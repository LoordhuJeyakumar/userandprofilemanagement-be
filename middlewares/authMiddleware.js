const jwt = require("jsonwebtoken");
const envProcessConfig = require("../config/config");

const getTokenFromRequest = (req) => {
  const { authorization } = req.headers;
  const isBearer = authorization?.startsWith("Bearer ");

  if (authorization && isBearer) {
    const token = authorization.substring(7);
    return token;
  }
  return null;
};

const authMiddleware = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, envProcessConfig.jwtSecret);
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  authMiddleware,
  getTokenFromRequest,
};
