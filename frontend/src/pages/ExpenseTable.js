import React from "react";

import {
  FaTrash,
  FaReceipt
} from "react-icons/fa";

const ExpenseTable = ({
  expenses,
  deleteExpens,
}) => {

  return (

    <div className="modern-table">

      {/* HEADER */}

      <div className="table-header">

        <div className="receipt-icon">
          <FaReceipt />
        </div>

        <div>

          <h1>
            Transaction History
          </h1>

          <p>
            Your recent expenses and transactions
          </p>

        </div>

      </div>

      {/* EMPTY */}

      {expenses.length === 0 ? (

        <div className="empty-state">

          <h2>
            No Transactions Yet
          </h2>

          <p>
            Add your first expense above
          </p>

        </div>

      ) : (

        expenses.map((expense, index) => (

          <div
            key={index}
            className="expense-card-row"
          >

            {/* LEFT */}

            <div className="expense-left">

              <div className="expense-avatar">

                {expense.text
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

              <div>

                <h3>
                  {expense.text}
                </h3>

                <p>
                  {expense.category}
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="expense-right">

              <h2
                style={{
                  color:
                    expense.amount > 0
                      ? "#27ae60"
                      : "#ef4444",
                }}
              >
                ₹{Math.abs(expense.amount)}
              </h2>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteExpens(expense._id)
                }
              >
                <FaTrash />
              </button>

            </div>

          </div>

        ))
      )}

    </div>
  );
};

export default ExpenseTable;