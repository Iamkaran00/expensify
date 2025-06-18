import { useEffect, useState } from "react";
import { getAllIncome } from "../service/operations/incomeservice";
import { getAllExpense } from "../service/operations/expenseService";
import { getDashboardOverview } from "../service/operations/dashboard.service";
import { getMeAPI } from "../service/operations/authAPI";
import { Navbar } from "../components/Navbar";
import IncomeExpenseBarChart from "../components/common/dashboardChart";
import "./dashboard.css";
import useNumberAnimation from "../utils/useNumbeAnimation";
import {
  FaShoppingBasket,
  FaUtensils,
  FaCar,
  FaHome,
  FaLightbulb,
  FaHeartbeat,
  FaBook,
  FaGamepad,
  FaCoffee,
  FaPlane,
  FaPhone,
  FaGift,
  FaTools,
  FaPaw,
} from "react-icons/fa";
import {
  FaBriefcase,
  FaLaptopCode,
  FaChartLine,
  
  FaMoneyBillWave,
  FaBuilding,
  FaPiggyBank,
  FaWallet,
  FaMoneyCheckDollar,
  FaMedal,
  FaLandmark,
} from "react-icons/fa6";
import { color } from "chart.js/helpers";
import { BiFontSize } from "react-icons/bi";

const DashboardPage = () => {
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpense, setTotalExpense] = useState(null);
  const [userName, setUserName] = useState(null);
  const [time, setTime] = useState("");
  const [incomeBarData, setIncomeBarData] = useState([]);
  const [expenseBarData, setExpenseBarData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const icons = [
    { name: "Salary", component: <FaBriefcase size={24} /> },
    { name: "Freelance Work", component: <FaLaptopCode size={24} /> },
    { name: "Investments", component: <FaChartLine size={24} /> },
    { name: "Gifts Received", component: <FaGift size={24} /> },
    { name: "Cashback & Rewards", component: <FaMoneyBillWave size={24} /> },
    { name: "Rent Income", component: <FaBuilding size={24} /> },
    { name: "Interest & Savings", component: <FaPiggyBank size={24} /> },
    { name: "Side Hustle", component: <FaWallet size={24} /> },
    { name: "Cash Income", component: <FaMoneyCheckDollar size={24} /> },
    { name: "Bonuses", component: <FaMedal size={24} /> },
    { name: "Government Benefits", component: <FaLandmark size={24} /> },

    {
      name: "Groceries",
      component: <FaShoppingBasket size={24} />,
      category: "expense",
    },
    {
      name: "Dining Out",
      component: <FaUtensils size={24} />,
      category: "expense",
    },
    {
      name: "Transportation",
      component: <FaCar size={24} />,
      category: "expense",
    },
    { name: "Housing", component: <FaHome size={24} />, category: "expense" },
    {
      name: "Utilities",
      component: <FaLightbulb size={24} />,
      category: "expense",
    },
    {
      name: "Healthcare",
      component: <FaHeartbeat size={24} />,
      category: "expense",
    },
    { name: "Education", component: <FaBook size={24} />, category: "expense" },
    { name: "Gaming", component: <FaGamepad size={24} />, category: "expense" },
    {
      name: "Coffee/Drinks",
      component: <FaCoffee size={24} />,
      category: "expense",
    },
    { name: "Travel", component: <FaPlane size={24} />, category: "expense" },
    {
      name: "Phone/Internet",
      component: <FaPhone size={24} />,
      category: "expense",
    },
    { name: "Gifts", component: <FaGift size={24} />, category: "expense" },
    {
      name: "Maintenance",
      component: <FaTools size={24} />,
      category: "expense",
    },
    { name: "Pet Care", component: <FaPaw size={24} />, category: "expense" },
  ];

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) {
      setTime("Morning");
    } else if (hours >= 12 && hours < 16) {
      setTime("Afternoon");
    } else if (hours >= 16 && hours < 20) {
      setTime("Evening");
    } else {
      setTime("Late Evening");
    }
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await getMeAPI();
      console.log("helloe");
      setUserName(response.firstName);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllDataForDashboard = async () => {
    try {
      const response = await getDashboardOverview();
      if (response.data) {
        console.log(response.data, "this is data");
        console.log(response.data.recentTransactions, "recenttransaction");
        setTransactions(response.data.recentTransactions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllExpenses = async () => {
    try {
      const response = await getAllExpense();
      if (response) {
        const total = response.data.reduce(
          (total, currValue) => total + Number(currValue.amount),
          0
        );
        setTotalExpense(total);
        let data = response.data.map((value) => ({
          date: new Date(value.date),
          amount: value.amount,
          categoryName: value.icon,
        }));
        setExpenseBarData(data);
        console.log(expenseBarData, "hey expense");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllIncomes = async () => {
    try {
      const response = await getAllIncome();
      if (response) {
        const total = response.data.reduce(
          (total, currValue) => total + Number(currValue.amount),
          0
        );
        const data = response.data.map((value) => ({
          date: new Date(value.date),
          amount: value.amount,
          categoryName: value.icon,
        }));
        setIncomeBarData(data);
        console.log("income bar data", data);
        setTotalIncome(total);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllExpenses();
    getAllIncomes();
    getAllDataForDashboard();
    getUserInfo();
  }, []);
  const data = { incomeBarData, expenseBarData };
  const balance = totalIncome - totalExpense;
  const animatedBalance = useNumberAnimation(balance, 1000);
  const animatedIncome = useNumberAnimation(totalIncome, 1000);
  const animatedExpense = useNumberAnimation(totalExpense, 1000);
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="right-div">
        <p className="name">
          Good {time} {userName}!
        </p>
        <div className="parent-money-div">
          <div className="boxes">
            <div className={"money-div"}>
              <p>Total Balance</p>
              <p>${animatedBalance}</p>
            </div>

            <div className="income-div">
              <p>Total Income</p>
              <p>${animatedIncome}</p>
            </div>
            <div className="expense-div">
              <p>Total Expense</p>
              <p>${animatedExpense}</p>
            </div>
          </div>
          <div>
            <IncomeExpenseBarChart
              incomeData={incomeBarData}
              expenseData={expenseBarData}
            />
          </div>
        </div>
        <div className="transactions">
          <p className="transactions-title">Recent Transactions</p>
          <div className="transactions-box">
            {transactions.map((value, index) => {
              return (
                <div
                  className={`${
                    value.type === "income" ? "incomes" : "expenses"
                  }`}
                >
                  <div className="titleandicon">
                    {icons.find((icon) => icon.name === value.icon)?.component}
                    <p className="dowhites">{value.icon}</p>
                  </div>
                  <div className="amountdiv">
                    <p className="dowhites">amount</p>
                    <p className="dowhites">${value.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
