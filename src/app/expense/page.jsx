"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "../_Components/Layout/Header";
import Footer from "../_Components/Layout/Footer";

const ExpenseTracker = () => {
  const cookies = new Cookies();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    if (!cookies.get("token")) {
      router.push("/login");
    }
  }, [cookies, router]);

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    console.log(page, limit);
    try {
      const response = await axios.get(`/api/expense`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
        params: { page, limit },
      });
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error(
        "Error retrieving expenses:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, limit]);

  // Add or update an expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      name,
      category,
      price: parseFloat(price),
      token: cookies.get("token"),
    };

    if (editId) {
      await axios.put(`/api/expense`, expenseData, {
        headers: {
          authorization: `Bearer ${cookies.get("token")}`, // Send token in Authorization header
        },
        params: { editId },
      });
    } else {
      const response = await axios.post("/api/expense", expenseData, {
        headers: {
          authorization: `Bearer ${cookies.get("token")}`, // Send token in Authorization header
        },
      });
      console.log(response.data);
    }

    setName("");
    setCategory("");
    setPrice("");
    setEditId(null);
    fetchExpenses();
  };

  // Edit expense
  const handleEdit = (expense) => {
    setEditId(expense._id);
    setName(expense.name);
    setCategory(expense.category);
    setPrice(expense.price);
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expense`, {
        headers: {
          authorization: `Bearer ${cookies.get("token")}`, // Send token in Authorization header
        },
        params: { id },
      });
      fetchExpenses();
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting expense");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-5">
        <form
          onSubmit={handleSubmit}
          className="glass-card mb-8 w-full max-w-md p-5"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Update Expense" : "Add New Expense"}
          </h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 mb-4 rounded-lg bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 mb-4 rounded-lg bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-2 mb-4 rounded-lg bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>

        <div className="w-full max-w-md">
          <label className="text-white mb-4 block">
            Show:
            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="ml-2 p-1 bg-white/50 backdrop-blur-md rounded-lg focus:outline-none"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>

          <ul>
            {expenses.map((expense) => (
              <li
                key={expense._id}
                className="glass-card p-4 mb-4 flex justify-between items-center bg-slate-100 rounded-lg opacity-60"
              >
                <div>
                  <strong className="text-xl text-black">{expense.name}</strong>
                  <p className="text-black">{expense.category}</p>
                  <p className="text-black">${expense.price}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(expense)}
                    className="mr-2 px-3 py-1 rounded-lg bg-purple-800 text-white hover:bg-purple-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="mr-2 px-3 py-1 rounded-lg bg-purple-800 text-white hover:bg-purple-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4 text-white">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExpenseTracker;
