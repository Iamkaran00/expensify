import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../service/operations/authAPI";
import { AuthContext } from "../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import img from "../assets/financialimg.png";
 import './signin.css';
const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const verifiedFields = (name, value) => {
    switch (name) {
      case "email":
        return value.trim() ? null : "email is required";
      case "password":
        return value.trim() ? null : "password is required";
      default:
        return null;
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = verifiedFields(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };
   
  const verifyform = () => {
  const newErrors = {};
  let isValid = true;
  Object.keys(formData).forEach((key) => {
    const error = verifiedFields(key, formData[key]);
    if (error) {
      newErrors[key] = error;
      isValid = false; // only set false if error exists
    }
  });
  setErrors(newErrors);
  return isValid;
};


  const handleOnSubmit = async (event) => {
    
    event.preventDefault();
    if (!verifyform()) {
      const firstError = Object.values(errors).find((error) => error);
      if (firstError) {
        toast.error(firstError);
        return;
      }
    }
    setLoading(true)
    const formPayload = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await loginUser(formPayload);

      if (response) {
        setLoading(false);
        login(response.user);
        toast.success("User Logged In Successfully");
        Navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false)
      console.log(error.message); 
       toast.error("logged in fail");
 
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signincontainer">
    
      <form onSubmit={handleOnSubmit} className="signinform">
          <p style={{fontSize:'2.2rem'}}>Login</p>
        <div className="form-groups">
          <label htmlFor="email"  style={{fontSize:'1.3rem'}}>Email *</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className= 'inputsign'
          />
          {errors.email && (
            <span className="error-messages">{errors.email}</span>
          )}
        </div>
        <div className="form-groups">
          <label htmlFor="Password" style={{fontSize:'1.3rem'}}>Password *</label>
          <input
            type="text"
            id="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="inputsign"
          />
          {errors.password && (
            <span className="error-messages">{errors.password}</span>
          )}
        </div>
    
          <button type="submit" className="submit-btn-signin" disabled={loading}>
            {loading ? "logging in..." : "log in"}
          </button>
         
      </form>
      <img src={img} alt="" className="signin-img"/>
    </div>
  );
};

export default Signin;
