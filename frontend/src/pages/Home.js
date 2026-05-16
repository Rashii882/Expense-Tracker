import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { APIUrl, handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";

import "./Home.css";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [expenses, setExpenses] = useState([]);

  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");

    handleSuccess("User Logged out");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    const amounts = expenses.map((item) => Number(item.amount));

    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => acc + item, 0);

    const exp =
      amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1;

    setIncomeAmt(income);
    setExpenseAmt(exp);
  }, [expenses]);

  const deleteExpens = async (id) => {
    try {
      const url = `${APIUrl}/expenses/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();

      handleSuccess(result?.message);
      setExpenses(result.data || []);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const url = `${APIUrl}/expenses`;

      const response = await fetch(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();
      setExpenses(result.data || []);
    } catch (err) {
      handleError(err);
    }
  };

  const addTransaction = async (data) => {
    try {
      const url = `${APIUrl}/expenses`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();

      handleSuccess(result?.message);
      setExpenses(result.data || []);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  // ✅ 🔥 FIXED PIE CHART (EVERY EXPENSE = SEPARATE SLICE)
  const categoryData = expenses
  .filter((item) => Number(item.amount) < 0)
  .map((curr) => ({
    name: curr.text || curr.category || "Expense",
    value: Math.abs(Number(curr.amount) || 0),
  }));
  // MONTHLY DATA
 const ALL_MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const monthlyData = ALL_MONTHS.map((month, index) => {

  const total = expenses
    .filter((curr) => new Date(curr.createdAt).getMonth() === index)
    .reduce((sum, curr) => {
      return sum + Math.abs(Number(curr.amount || 0));
    }, 0);

  return {
    month,
    amount: total,
  };
});

  const COLORS = [
    "#57c7c3",
    "#ff6b6b",
    "#4db6d6",
    "#f5b700",
    "#ff6200",
    "#38b000",
    "#8338ec",
  ];

  return (
    <div className="dashboard">

      {/* WELCOME */}
      <div className="welcome-section">
        <h1>Welcome {loggedInUser}</h1>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* SUMMARY */}
      <div className="summary-section">

        <div className="summary-card income-card">
          <h3>Income</h3>
          <h1>₹{incomeAmt.toFixed(2)}</h1>
        </div>

        <div className="summary-card expense-card">
          <h3>Expenses</h3>
          <h1>₹{expenseAmt.toFixed(2)}</h1>
        </div>

        <div className="summary-card balance-card">
          <h3>Balance</h3>
          <h1>₹{(incomeAmt - expenseAmt).toFixed(2)}</h1>
        </div>

      </div>

      {/* CHARTS */}
      <div className="charts-wrapper">

        {/* PIE CHART */}
        <div className="chart-card">
          <h2>Expense Categories</h2>

          <div className="chart-box">

            {categoryData.length === 0 ? (
              <div className="empty-chart">
                <h2>No Expense Data</h2>
                <p>Add expenses to see analytics</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>

                <PieChart>

                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={4}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>
            )}

          </div>
        </div>

        {/* BAR CHART */}
        <div className="chart-card">
          <h2>Monthly Expenses</h2>

          <div className="chart-box">

            {monthlyData.length === 0 ? (
              <div className="empty-chart">
                <h2>No Monthly Data</h2>
                <p>Add expenses first</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="amount"
                    fill="#57c7c3"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

      </div>

      {/* FORM */}
      <ExpenseForm addTransaction={addTransaction} />

      {/* TABLE */}
      <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />

      <ToastContainer />

    </div>
  );
}

export default Home;