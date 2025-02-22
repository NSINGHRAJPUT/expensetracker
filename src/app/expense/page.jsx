"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "../_Components/Layout/Header";
import Footer from "../_Components/Layout/Footer";
import Loader from "../_Components/Loader";

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
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cookies.get("token")) {
      router.push("/login");
    }
  }, [cookies, router]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    console.log(page, limit);
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/expense`,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
          params: { page, limit },
        }
      );
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error(
        "Error retrieving expenses:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, limit]);

  // Add or update an expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const expenseData = {
      name,
      category,
      price: parseFloat(price),
      token: cookies.get("token"),
    };

    try {
      if (editId) {
        await axios.put(`/api/expense`, expenseData, {
          headers: {
            authorization: `Bearer ${cookies.get("token")}`, // Send token in Authorization header
          },
          params: { editId },
        });
      } else {
        const response = await axios.post(
          "/api/expense",
          expenseData,
          {
            headers: {
              authorization: `Bearer ${cookies.get("token")}`, // Send token in Authorization header
            },
          }
        );
        console.log(response.data);
      }

      setName("");
      setCategory("");
      setPrice("");
      setEditId(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Error saving expense");
    } finally {
      setLoading(false);
    }
  };

  // Edit expense
  const handleEdit = (expense) => {
    setEditId(expense._id);
    setName(expense.name);
    setCategory(expense.category);
    setPrice(expense.price);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setCategory("");
    setPrice("");
  };

  // Delete expense
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `https://expensetracker-lake-alpha.vercel.app/api/expense`,
        {
          headers: {
            authorization: `Bearer ${cookies.get("token")}`, // Send token in Authorization header
          },
          params: { id },
        }
      );
      fetchExpenses();
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Header onToggleTheme={toggleTheme} />
      <div
        className={`flex flex-col items-center min-h-screen p-5 ${
          theme === "light"
            ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            : "bg-gradient-to-r from-gray-700 via-gray-900 to-black"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`glass-card mb-8 w-full max-w-md p-5 ${
            theme === "light" ? "bg-white/50" : "bg-gray-800/50"
          }`}
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
            className={`w-full p-2 mb-4 rounded-lg ${
              theme === "light"
                ? "bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                : "bg-gray-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            }`}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={`w-full p-2 mb-4 rounded-lg ${
              theme === "light"
                ? "bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                : "bg-gray-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            }`}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={`w-full p-2 mb-4 rounded-lg ${
              theme === "light"
                ? "bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                : "bg-gray-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            }`}
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className={`w-full py-2 rounded-lg ${
                theme === "light"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              } transition`}
            >
              {editId ? "Update Expense" : "Add Expense"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`w-full py-2 rounded-lg ml-2 ${
                  theme === "light"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                } transition`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="w-full max-w-md">
          <label className="text-white mb-4 block">
            Show:
            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="ml-2 p-1 bg-white/50 backdrop-blur-md rounded-lg focus:outline-none text-black"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>

          <ul>
            {expenses
              .filter((expense) => expense._id !== editId)
              .map((expense) => (
                <li
                  key={expense._id}
                  className={`glass-card p-4 mb-4 flex justify-between items-center rounded-lg opacity-60 ${
                    theme === "light" ? "bg-slate-100" : "bg-gray-800"
                  }`}
                >
                  <div>
                    <strong
                      className={`text-xl ${
                        theme === "light" ? "text-black" : "text-white"
                      }`}
                    >
                      {expense.name}
                    </strong>
                    <p
                      className={
                        theme === "light" ? "text-black" : "text-white"
                      }
                    >
                      {expense.category}
                    </p>
                    <p
                      className={
                        theme === "light" ? "text-black" : "text-white"
                      }
                    >
                      ${expense.price}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(expense)}
                      className={`mr-2 px-3 py-1 rounded-lg ${
                        theme === "light"
                          ? "bg-purple-800 text-white hover:bg-purple-600"
                          : "bg-gray-600 text-white hover:bg-gray-400"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className={`mr-2 px-3 py-1 rounded-lg ${
                        theme === "light"
                          ? "bg-purple-800 text-white hover:bg-purple-600"
                          : "bg-gray-600 text-white hover:bg-gray-400"
                      }`}
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
              className={`px-4 py-2 rounded-lg ${
                theme === "light"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded-lg ${
                theme === "light"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
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
