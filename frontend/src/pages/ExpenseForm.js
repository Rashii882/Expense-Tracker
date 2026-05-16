import React, { useState } from "react";
import { handleError } from "../utils";
import { FaWallet } from "react-icons/fa";

function ExpenseForm({ addTransaction }) {

  const [type, setType] = useState("expense");

  const [expenseInfo, setExpenseInfo] = useState({
    amount: "",
    text: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setExpenseInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addExpenses = (e) => {
    e.preventDefault();

    const { amount, text, category } = expenseInfo;

    if (!amount || !text) {
      handleError("Please add required details");
      return;
    }

    // 👉 CATEGORY ONLY REQUIRED FOR EXPENSE
    if (type === "expense" && !category) {
      handleError("Please select category for expense");
      return;
    }

    const finalData = {
      text,
      amount: type === "expense"
        ? -Math.abs(Number(amount))
        : Math.abs(Number(amount)),
      category: type === "expense" ? category : "Income",
      type,
    };

    addTransaction(finalData);

    setExpenseInfo({
      amount: "",
      text: "",
      category: "",
    });
  };

  return (
    <div className="modern-form">

      <div className="form-header">
        <div className="wallet-icon">
          <FaWallet />
        </div>

        <h1>Add Transaction</h1>
        <p>Track income and expenses easily</p>
      </div>

      {/* TYPE SELECT */}
      <div className="form-group">
        <label>Type</label>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <form onSubmit={addExpenses}>

        {/* TEXT */}
        <div className="form-group">
          <label>Detail</label>

          <input
            onChange={handleChange}
            type="text"
            name="text"
            placeholder="Enter detail..."
            value={expenseInfo.text}
          />
        </div>

        {/* AMOUNT */}
        <div className="form-group">
          <label>Amount</label>

          <input
            onChange={handleChange}
            type="number"
            name="amount"
            placeholder="Enter amount..."
            value={expenseInfo.amount}
          />
        </div>

        {/* CATEGORY (ONLY FOR EXPENSE) */}
        {type === "expense" && (
          <div className="form-group">
            <label>Category</label>

            <select
              onChange={handleChange}
              name="category"
              value={expenseInfo.category}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
               <option value="Other">Other</option>
            </select>
          </div>
        )}

        <button type="submit" className="expense-btn">
          Add {type === "expense" ? "Expense" : "Income"}
        </button>

      </form>
    </div>
  );
}

export default ExpenseForm;