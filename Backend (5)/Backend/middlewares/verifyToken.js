// import jwt from "jsonwebtoken";
// import pool from "../config/db.js";

// export const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader)
//     return res
//       .status(403)
//       .json({ success: false, message: "Access denied, token missing" });

//   const token = authHeader.split(" ")[1];
//   if (!token)
//     return res
//       .status(403)
//       .json({ success: false, message: "Access denied, token missing" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Fetch user from database
//     const [users] = await pool.query(
//       "SELECT * FROM UserRegister WHERE id=?",
//       [decoded.id]
//     );

//     if (users.length === 0)
//       return res
//         .status(401)
//         .json({ success: false, message: "User not found" });

//     req.user = users[0]; // Attach full user info
//     next();
//   } catch (err) {
//     console.error("Verify Token Error:", err);
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid token" });
//   }
// };

import jwt from "jsonwebtoken";

// ====================================================
// ✅ Strict Token Verification Middleware
//    - Use when route must be protected (login required)
// ====================================================
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info
    next();
  } catch (err) {
    console.error("❌ Token Verification Failed:", err.message);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// ====================================================
// ✅ Optional Token Middleware (Guest Allowed)
//    - Use for routes that can work with or without login
// ====================================================
export const tryVerifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.warn("⚠️ Optional Token Invalid:", err.message);
      req.user = null; // ignore invalid token
    }
  } else {
    req.user = null; // no token, proceed as guest
  }

  next();
};

