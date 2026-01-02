const admin = require("../models/admin.schema");
const { verifyAccessToken } = require("../utils/tokens");

async function adminAuth(req, res, next) {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const payload = verifyAccessToken(token);

    const loginUser = await admin.findOne({ email: payload?.email });
    if (!loginUser) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.user = loginUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/Expired Access Token" });
  }
}

module.exports = adminAuth;
