import jwt from "jsonwebtoken";
import env from "../config/env.js";

const optionalAuth = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;

    // Bearer Token
    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    // Cookie Token
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // Guest User
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      );

      req.user = decoded;
    } catch (err) {
      console.log(
        "Invalid Token -> Guest Mode"
      );

      req.user = null;
    }

    next();

  } catch (error) {

    console.error(error);

    req.user = null;

    next();
  }
};

export default optionalAuth;