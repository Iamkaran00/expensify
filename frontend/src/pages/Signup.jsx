import { useContext, useState } from "react";
import { registerUser } from "../service/operations/authAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import img from "../assets/financialimg.png";

import Loader from "../components/common/Loader";
import "./signup.css";
import { AuthContext } from "../context/authContext";
const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { login, user, signup } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });
 
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2 megabytes");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 300;
      const MAX_HEIGHT = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round(width * (MAX_HEIGHT / height));
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        setFormData((prev) => ({ ...prev, profilePic: resizedFile }));
        setPreviewUrl(canvas.toDataURL(file.type));
      }, file.type);
    };

    img.src = URL.createObjectURL(file);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";

    const domain = email.split("@")[1].toLowerCase();
    const commonDomains = {
      "gmal.com": "gmail.com",
      "gmil.com": "gmail.com",
      "gamil.com": "gmail.com",
      "gnail.com": "gmail.com",
      "gmaill.com": "gmail.com",
      "gail.com": "gmail.com",
    };

    if (commonDomains[domain]) {
      return `Did you mean ${email.split("@")[0]}@${commonDomains[domain]}?`;
    }

    return null;
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return !value.trim() ? "First name is required" : null;

      case "lastName":
        return !value.trim() ? "Last name is required" : null;

      case "email":
        if (!value.trim()) return "Email is required";
        return validateEmail(value);

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        return null;

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return null;

      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (key === "profilePic") return;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.values(errors).find((error) => error);
      if (firstError) toast.error(firstError);
      return;
    }
    setLoading(true);
    const formPayload = new FormData();
    formPayload.append("firstName", formData.firstName.trim());
    formPayload.append("lastName", formData.lastName.trim());
    formPayload.append("email", formData.email.trim());
    formPayload.append("password", formData.password);
    if (formData.profilePic) {
      formPayload.append("file", formData.profilePic);
    }
    try {
      const response = await registerUser(formPayload);
      if (response) {
        login(response.user);
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message === "User already exists") {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
        toast.error("This email is already registered");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
     
      <div className="signup-container">
        <div className="scontainer">
        <p style={{fontSize:'2rem'}}>Create an Account</p>

        <form onSubmit={handleSubmit} className="formsignup">
          <div className="form-group">
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              name="file"
              onChange={handleImageChange}
              className="file-input"
            />
            
            {previewUrl && (
              <div className="image-preview">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  style={{
                    width: "9rem",
                    height: "9rem",
                    objectFit: "cover",
                    objectPosition:"center",
                    borderRadius: "30%",
                  }}
                />
              </div>
            )}
             <label htmlFor="profilePic">Profile Picture</label>
          </div>

          {/* First Name */}
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? "input-error" : ""}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? "input-error" : ""}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>

          {/* Email Addr                                          ess */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="login-link" style={{fontSize:'23px'}}>
            Already have an account? <a href="/signin">Log in</a>
          </p>
        </form>
        </div>
         
     
    </div>
  );
};

export default Signup;
