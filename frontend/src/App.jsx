import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Loader from "./components/common/Loader";
const Signin = lazy(() => import("./pages/signin"));
import Notfound from "./pages/notfound";
const Signup = lazy(() => import("./pages/signup"));
const Home = lazy(() => import("./pages/Home"));
const Income = lazy(() => import("./pages/IncomePage"));
const DashboardPage = lazy(()=>import('./pages/DashboardPage'))
const Expense = lazy(() => import("./pages/expensePage"));
const ProtectedRoute = lazy(() => import("./ProtectedRoutes"));
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
