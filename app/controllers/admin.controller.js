const admin = require("../models/admin.schema");
const statusCode = require("../config/status");
const bcrypt = require("bcrypt");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/tokens");
const { cookieOptions } = require("../utils/cookies");

class adminController {
  async signUP(req, res) {
    try {
      const saltRounds = 10;
      const { fullname, email, password, role } = req.body;

      if (!fullname || !email || !password || !role) {
        return res.status(statusCode.forbidden).json({ message: "Please Fill the all fields" });
      }

      const existing = await admin.findOne({ email });
      if (existing) {
        return res.status(statusCode.forbidden).json({ message: "Admin Already Exists" });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await admin.create({ fullname, email, password: hashedPassword, role });

      return res.status(statusCode.created).json({ message: "Admin Created Successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Admin Creation Failed", error: err?.message || String(err) });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(statusCode.forbidden).json({ message: "Please Fill the all fields" });
      }

      const user = await admin.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // minimal payload
      const payload = { email: user.email, role: user.role, id: user._id };

      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);

      const accessMaxAge = 15 * 60 * 1000;          
      const refreshMaxAge = 7 * 24 * 60 * 60 * 1000; 

      res.cookie("accessToken", accessToken, cookieOptions(accessMaxAge));
      res.cookie("refreshToken", refreshToken, cookieOptions(refreshMaxAge));

      return res.status(statusCode.success).json({
        message: "Login Successfully!",
        data: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Login Server Error", error: err?.message || String(err) });
    }
  }


  async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
      }

      const payload = verifyRefreshToken(refreshToken);

      const user = await admin.findOne({ email: payload.email });
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newPayload = { email: user.email, role: user.role, id: user._id };
      const newAccessToken = signAccessToken(newPayload);

      const accessMaxAge = 15 * 60 * 1000; // 15 min
      res.cookie("accessToken", newAccessToken, cookieOptions(accessMaxAge));

      return res.status(200).json({ message: "Token refreshed" });
    } catch (err) {
      return res.status(401).json({ message: "Invalid/Expired Refresh Token" });
    }
  }

  async signout(req, res) {
    try {
      const isProd = process.env.NODE_ENV === "production";
      const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      };

      return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(200)
        .json({ message: "Logout successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Logout Server Error" });
    }
  }
}

module.exports = new adminController();
