const authenticateToken = require("../../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("@/dbConfig/db");
const { NextResponse } = require("next/server");
const expenseUser = require("../../../model/User");

connectDB();

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();
    console.log(email, password);
    // Find user by email
    const user = await expenseUser.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to login",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const user = await authenticateToken(req);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve user profile",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
};
