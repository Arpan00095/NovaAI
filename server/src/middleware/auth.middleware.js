import jwt from "jsonwebtoken";
import env from "../config/env.js";

const verifyToken = (req, res, next) => {
  try {
    let token = null;

    // Authorization Header
    const authHeader = req.headers.authorization;

    // 👇 YAHAN ADD KARO
    console.log("Authorization Header:", authHeader);
    console.log("Cookie Token:", req.cookies.token);

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback to Cookie
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    // 👇 YAHAN ADD KARO
    console.log("Final Token:", token);
    console.log("JWT Secret Exists:", !!env.JWT_SECRET);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 👇 YAHAN ADD KARO
    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();
  } catch (error) {

    // 👇 YAHAN ADD KARO
    console.log("JWT Verify Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyToken;