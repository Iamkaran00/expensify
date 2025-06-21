import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import DailyIncomeChart from "../components/IncomeChart";
import { Navbar } from "../components/Navbar";
 import { deleteIncomes } from "../service/operations/incomeservice";
import {
  createIncome,
  getAllIncome,
} from "../service/operations/incomeservice";
import "./income.css";
import { MdDelete } from "react-icons/md";
import {
  FaBriefcase,
  FaLaptopCode,
  FaChartLine,
  FaGift,
  FaMoneyBillWave,
  FaBuilding,
  FaPiggyBank,
  FaWallet,
  FaMoneyCheckDollar,
  FaMedal,
  FaLandmark,
} from "react-icons/fa6";
import useNumberAnimation from "../utils/useNumbeAnimation";
const IncomePage = () => {
  const [formData, setFormData] = useState({
    icon: "",
    title: "",
    amount: "",
    description: "",
    categoryName: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setError] = useState({});
  const [chartDataArray, setChartDataArray] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [totaldata, setTotaldata] = useState([]);
 const [hasNoElement,setHasNoElement] = useState(true);
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
  ];
  const validateError = (name, value) => {
    switch (name) {
      case "title":
        return value.trim() === "" ? "Fill the title form" : null;
      case "amount":
        if (value === "") return "Enter amount";
        if (Number(value) <= 0) return "Amount must be positive";
        return null;

      case "categoryName":
        return value.trim() === "" ? "Select category" : null;
      default:
        return null;
    }
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: validateError(name, value),
    }));
  };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categoryName: value,
      icon: value,
    }));
    setSelectedValue(value);
    setError((prev) => ({
      ...prev,
      categoryName: validateError("categoryName", value),
    }));
  };
  const buildchartData = (data) => {
    console.log(data, "data");
    const newChartData = data.map((value) => ({
      date: new Date(value.date),
      amount: value.amount,
      categoryName: value.icon,
    }));
    setChartDataArray(newChartData);
  };

  const getTotalIncome = async () => {
    try {
      const response = await getAllIncome();
      if (response?.data) {
        setTotaldata(response.data);
        if(response.data.length === 0){
  setHasNoElement(true)
        }
        else setHasNoElement(false);
        const total = response.data.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );
        setTotalAmount(total);
        buildchartData(response.data);
      }
    } catch (error) {
      console.error("Error fetching income:", error);
      toast.error("Failed to fetch income data");
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateError(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setError(newErrors);

    if (!isValid) {
      const firstError = Object.values(newErrors).find((err) => err);
      if (firstError) toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      const response = await createIncome(formData);
      if (response) {
        toast.success("Income created successfully");
        setFormData({
          icon: "",
          title: "",
          amount: "",
          description: "",
          categoryName: "",
        });
        setSelectedValue("");
        await getTotalIncome();
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Failed to create income");
    } finally {
      setLoading(false);
    }
  };
  const deleteincomes = async (id) => {
    try {
      const response = await deleteIncomes(id);
      console.log(response, "response");
      if (response) {
        await getTotalIncome();
        toast.success("income deleted successfully");
      }
    } catch (error) {
      console.log(error,'this is the error');
      toast.error("could not delete income");
    }
  };
  useEffect(() => {
    getTotalIncome();
  }, []);
  const animatedIncome = useNumberAnimation(totalAmount.toFixed(2));
  return (
    <div className="incomeContainer">
      <Navbar />
      <div className="right-div-income">
        <p style={{ fontSize: "2.5rem" }}>Your Realtime Incomes Show Here</p>
        <div className="chartandform">
          <div className="income-form">
            <div className="total-income">
              <p className="dowhite">Total Income</p>
              <p className="dowhite">${animatedIncome}</p>
            </div>
            <div className="incomeform">
              <p style={{ color: "rgb(255, 255, 255)", fontSize: "2.1rem" }}>
                Add Income
              </p>
              <form onSubmit={handleOnSubmit}>
                <div className="inputdiv">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleOnChange}
                    placeholder="Enter The Title"
                  />
                  {errors.title && (
                    <span className="error-message" style={{ color: "red" }}>
                      {errors.title}
                    </span>
                  )}
                </div>
                <div className="inputdiv">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    min="1"
                    onChange={handleOnChange}
                    placeholder="Enter The Amount (in $) "
                  />
                  {errors.amount && (
                    <span className="error-message" style={{ color: "red" }}>
                      {errors.amount}
                    </span>
                  )}
                </div>
                <div className="inputdiv">
                  <label htmlFor="description">Description (Optional)</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleOnChange}
                    placeholder="Enter The Description"
                  />
                </div>
                <div className="inputdiv">
                  <label>Category</label>
                  <select
                    value={selectedValue}
                    onChange={handleCategoryChange}
                    className="selecttag"
                  >
                    <option value="">Select category</option>
                    {icons.map((icon, idx) => (
                      <option key={idx} value={icon.name}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryName && (
                    <span className="error-message" style={{ color: "red" }}>
                      {errors.categoryName}
                    </span>
                  )}
                </div>
                <div className="add-income-button">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btnincome"
                  >
                    {loading ? "Adding income..." : "Add Income"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div>
            <DailyIncomeChart income={chartDataArray} />
          </div>
        </div>
        <div>
          <div className="incomesummary">
            <p style={{ fontSize: "2.5rem" }}>Details of income</p>
            <div className="incomesum">
            
              { hasNoElement?<p style={{fontSize:'1.5rem'}}>No Income data Generated Yet....</p>:
              
              totaldata.map((value, index) => (
                <div key={index} className="detailofincomediv">
                  <div>
                    <div className="iconandamountdiv">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        {
                          icons.find((icon) => icon.name === value.icon)
                            ?.component
                        }
                        <p style={{ color: "white" }}>{value.icon}</p>
                      </div>
                      <MdDelete
                        onClick={() => {
                          deleteincomes(value._id);
                        }}
                        style={{
                          fontSize: "1.6rem",
                          color: "rgb(252, 38, 38)",
                          cursor:"pointer",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      <p style={{ color: "white" }}>amount</p>
                      <p style={{ color: "white" }}>
                        {" "}
                        ${Number(value.amount).toFixed(2)}
                      </p>
                    </div>
                    <p style={{ color: "white" }}>{value.description}</p>
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default IncomePage;
