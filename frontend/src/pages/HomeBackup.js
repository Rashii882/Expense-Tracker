import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [darkMode, setDarkMode] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
   useEffect(() => {
    const amounts = expenses.map(item => Number(item.amount));

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0);

    const exp = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1;

    setIncomeAmt(income);
    setExpenseAmt(exp);

}, [expenses])

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data || []);;
        } catch (err) {
            handleError(err);
        }
    }

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            console.log('--result', result.data);
           setExpenses(result.data || []);;
        } catch (err) {
            handleError(err);
        }
    }



    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
           setExpenses(result.data || []);;
        } catch (err) {
            handleError(err);
        }
    }

 useEffect(() => {
  fetchExpenses();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
const categoryData = expenses
  .filter(item => Number(item.amount) < 0)
  .reduce((acc, curr) => {
    const category = curr.category || "Others";

    const existing = acc.find(item => item.name === category);

    if (existing) {
      existing.value += Math.abs(Number(curr.amount));
    } else {
      acc.push({
        name: category,
        value: Math.abs(Number(curr.amount))
      });
    }

    return acc;
  }, []);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];
const balanceData = [
  { name: "Income", value: incomeAmt },
  { name: "Expense", value: expenseAmt }
];
return (
        <div className={darkMode ? "dark-container" : "light-container"}>
            <div className='user-section'>
                <h1>Welcome {loggedInUser}</h1>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
</button>

            </div>
            <ExpenseDetails
                incomeAmt={incomeAmt}
                expenseAmt={expenseAmt}
            />
            

            <ExpenseForm
                addTransaction={addTransaction} />

           <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap", marginTop: "30px" }}>

  {/* Expense By Category Chart */}

  <div
    className='chart-container'
    style={{
      background: darkMode ? "#1e1e1e" : "#fff",
      color: darkMode ? "white" : "black",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}
  >
    <h2 style={{ textAlign: "center" }}>
      Expense By Category
    </h2>

    <PieChart width={400} height={300}>
      <Pie
        data={categoryData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {categoryData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </div>

  {/* Income vs Expense Chart */}

  <div
    className='chart-container'
    style={{
      background: darkMode ? "#1e1e1e" : "#fff",
      color: darkMode ? "white" : "black",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}
  >
    <h2 style={{ textAlign: "center" }}>
      Income vs Expense
    </h2>

    <PieChart width={400} height={300}>
      <Pie
        data={balanceData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {balanceData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </div>

</div>
            <ExpenseTable
                expenses={expenses}
                deleteExpens={deleteExpens}
            />
            <ToastContainer />
        </div>
    )
}

export default Home