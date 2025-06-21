import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Loader from "./components/common/Loader.jsx";
const Signin = lazy(() => import("./pages/Signin.jsx"));
import Notfound from "./pages/Notfound";
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Income = lazy(() => import("./pages/IncomePage.jsx"));
const DashboardPage = lazy(()=>import('./pages/DashboardPage.jsx'))
const Expense = lazy(() => import("./pages/ExpensePage.jsx"));
const ProtectedRoute = lazy(() => import("./ProtectedRoutes.jsx"));
function App() {
  return (
    <Router>
      <AuthProvider>
        
        <Suspense fallback={<Loader />}>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route element={<ProtectedRoute />}>
             
               <Route path = "/dashboard" element = {<DashboardPage/>} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
                 
            </Route>
            <Route path="*" element={<Notfound />} />
          </Routes>
           
        </Suspense>
 
       </AuthProvider>
    </Router>
  );
}
export default App;
