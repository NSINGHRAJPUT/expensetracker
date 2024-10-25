const expenseUser = require("@/model/User");
const jwt = require("jsonwebtoken");

const authenticateToken = async (req) => {
  const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer token

  if (!token) return null;

  try {
    console.log("Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded.id);
    const user = await expenseUser.findById(decoded.id);
    console.log(user);
    return user;
  } catch (error) {
    console.error("Token authentication failed:", error);
    return null;
  }
};

module.exports = authenticateToken;
