import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useNumberAnimation from "../utils/useNumbeAnimation";
import DailyExpenseChart from "../components/Chart";
import { Navbar } from "../components/Navbar";
import { MdDelete } from "react-icons/md";
import "./expense.css";
import {
  createExpense,
  getAllExpense,
  deleteExpense
} from "../service/operations/expenseService";
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
const ExpensePage = () => {
  const [loading, setLoading] = useState(false);
  const [allExpense, setAllExpense] = useState([]);
  const [chartDataArray, setChartDataArray] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  const [formData, setFormData] = useState({
    icon: "",
    title: "",
    categoryName: "",
    description: "",
    amount: "",
  });
  const icons = [
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
  const verifyErrors = (name, value) => {
    switch (name) {
      case "title":
        return value.trim() === "" ? "title field is missing" : null;

      case "amount":
        if (value.trim() === "") return "amount field is missing";
        if (Number(value) <= 0) return "Amount must be positive";
        return null;
      case "categoryName":
        return value.trim() === "" ? "Select category" : null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = verifyErrors(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categoryName: value,
      icon: value,
    }));
    setSelectedValue(value);
    setErrors((prev) => ({
      ...prev,
      categoryName: verifyErrors("categoryName", value),
    }));
  };
 
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = verifyErrors(key, formData[key]);
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    if (!isValid) {
      const firstError = Object.values(newErrors).find((error) => error);
      if (firstError) toast.error(firstError);
      return;
    }
    setLoading(true);
    try {
      const response = await createExpense(formData);
      if (response) {
        toast.success("expense added successfully");
        setFormData({
          icon: "",
          title: "",
          categoryName: "",
          description: "",
          amount: "",
        });
        setSelectedValue("");
        await getallexpenses();
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Cannot create Expense try again...");
    } finally {
      setLoading(false);
    }
  };
  const [hasNoElement, setHasNoElement] = useState(true);
 const buildchartData = (data) => {
  // Create a new array instead of mutating chartDataArray directly
  const newChartData = data.map((value) => ({
    date: new Date(value.date),
    amount: value.amount,
    categoryName: value.icon,
  }));
  setChartDataArray(newChartData); // Update state with new array
};

const getallexpenses = async () => {
  try {
    const response = await getAllExpense();
    if (response?.data) {
      setHasNoElement(response.data.length === 0);
      setAllExpense(response.data);
      const total = response.data.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.amount),
        0
      );
      setTotalAmount(total);
      buildchartData(response.data); // Rebuild chart data
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch expense data");
  }
};

const deleteexpense = async (id) => {
  try {
    await deleteExpense(id);
    toast.success("Expense deleted successfully");
    await getallexpenses(); // Fetch updated expenses and rebuild chart data
  } catch (error) {
    toast.error("Could not delete expense");
    console.error(error);
  }
};

useEffect(() => {
  getallexpenses();
}, []);
  const animatedExpense = useNumberAnimation(totalAmount);
  return (
    <div className="expenseContainer">
      <Navbar />
      <div className="right-div-expense">
        <p style={{fontSize:"2.4rem"}}>All Your Expenses Show Here</p>
        <div className="formandchartexpense">
          <div className="expense-box">
            <div className="total-expense">
              <p className="dowhitess">Total Expense</p>
             <p className="dowhitess">{animatedExpense}$</p>
            </div>
            <div className="expense-form"> 
              <p style={{color:"white",fontSize:'2rem'}}>Add Expense</p>
             <form onSubmit={handleOnSubmit}>
            <div  className="inputdivs">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter The Title"
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>
            <div className="inputdivs">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                min="1"
                onChange={handleChange}
                placeholder="Enter The Amount(in $)"
              />
              {errors.amount && (
                <span className="error-message">{errors.amount}</span>
              )}
            </div>
            <div className="inputdivs">
              <label htmlFor="description">Description(Optional) </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter The Description"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
            <div className="inputdivs">
              <label>Category</label>
              <select value={selectedValue} onChange={handleCategoryChange} className="selecttagexpense">
                <option >Select category</option>
                {icons.map((icon, idx) => (
                  <option key={idx} value={icon.name}>
                    {icon.name}
                  </option>
                ))}
              </select>
              {errors.categoryName && (
                <span className="error-message">{errors.categoryName}</span>
              )}
            </div>
            
              <button type="submit" disabled={loading} className="submit-expense-button">
                {loading ? "Adding expense..." : "Add Expense"}
              </button>
          </form>
          </div>
          </div>
          <div>
            <DailyExpenseChart expenses={chartDataArray} />
          </div>
        </div>
        <div className="allexpense">
          <p style={{fontSize:"2.3rem"}}>All Expenses Related To User</p>
          <div className="insideallexpense">
            {hasNoElement
              ? <p style={{fontSize:"1.5rem"}}>No Expense Data generated yet...
              </p>  
              : allExpense.map((value, index) => (
                  <div key={index} className="expenseinfobox">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div className="iconsandtitle">
                      {
                        icons.find((icon) => icon.name === value.icon)
                          ?.component
                      }
                      <p>{value.title}</p> 
                      </div>
                      <MdDelete onClick={()=>{deleteexpense(value._id)}} style={{fontSize:"1.6rem",color:"white",cursor:"pointer"}}/>
                      </div>
                      <div style={{display:"flex", justifyContent:"space-between",alignItems:"center"}}>
                        <p style={{color:"white",fontSize:"1.2rem"}}>amount</p>
                        <p style={{color:"white",fontSize:"1.2rem"}}>{value.amount.toFixed(2)}$</p>
                      </div>
                      <p style={{color:"white",fontSize:"1.2rem"}}>{value.description}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
