const expenseUser = require("@/model/User");
const jwt = require("jsonwebtoken");

const authenticateToken = async (req) => {
  const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer token

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await expenseUser.findById(decoded.id);
    return user;
  } catch (error) {
    console.error("Token authentication failed:", error);
    return null;
  }
};

module.exports = authenticateToken;
