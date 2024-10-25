const authenticateToken = require("../../../middleware/auth");
const connectDB = require("../../../dbConfig/db");
const { NextResponse } = require("next/server");
const Expense = require("../../../model/Expense");

connectDB();

export const POST = async (req) => {
  try {
    const user = await authenticateToken(req); // Authenticate user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { name, category, price } = await req.json();
    // Create new expense with the user ID from token
    const newExpense = new Expense({
      name,
      category,
      price,
      user: user._id,
    });
    await newExpense.save();

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add expense",
        error: error.message,
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
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Parse URL to get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 5;
    const page = parseInt(searchParams.get("page")) || 1;

    // Retrieve expenses for the user with pagination
    const expenses = await Expense.find({ user: user._id })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalExpenses = await Expense.countDocuments({ user: user._id });
    return NextResponse.json({
      success: true,
      expenses,
      totalExpenses,
      currentPage: page,
      totalPages: Math.ceil(totalExpenses / limit),
    });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve expenses",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const user = await authenticateToken(req); // Authenticate user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const expenseId = searchParams.get("editId");

    const { name, category, price } = await req.json();
    console.log(name, category, price, user);
    // Find and update the expense belonging to the authenticated user
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: user._id },
      { name, category, price },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found or unauthorized",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update expense",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const user = await authenticateToken(req); // Authenticate user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const expenseId = searchParams.get("id");

    // Find and delete the expense belonging to the authenticated user
    const deletedExpense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: user._id,
    });

    if (!deletedExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found or unauthorized",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete expense",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
