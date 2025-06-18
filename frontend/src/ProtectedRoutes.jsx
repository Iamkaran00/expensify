import { useContext, useState, useEffect } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { getMeAPI } from "./service/operations/authAPI";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const verify = async () => {
      try {
        const userData = await getMeAPI();
        if (userData) setAuthenticated(true);
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);
  if (loading) return <div>Loading...</div>;
  return authenticated ? <Outlet /> : <Navigate to="/" />;
};
export default ProtectedRoute;
