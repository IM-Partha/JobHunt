import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyEmail from "./components/auth/VerifyEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browser from "./components/Browser";
import Profile from "./components/ui/Profile";
import Descriptiopage from "./components/ui/Descriptiopage";
import Companies from "./components/admin/Companies";
import Compnaicreate from "./components/admin/Compnaicreate";
import Compnaisetup from "./components/admin/Compnaisetup";
import Adminjobs from "./components/admin/Adminjobs";
import Postjob from "./components/admin/Postjob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/Protectedroute";

const App = () => {
  return (
    <>
      {/* Navbar is always visible */}
      <Navbar />

      {/* All routes inside one <Routes> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/browse" element={<Browser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/detail/:id" element={<Descriptiopage />} />

        {/* Admin Routes */}
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/create"
          element={
            <ProtectedRoute>
              <Compnaicreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:id"
          element={
            <ProtectedRoute>
              <Compnaisetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <Adminjobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/job/create"
          element={
            <ProtectedRoute>
              <Postjob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id/applicants"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Footer is always visible */}
      <Footer />
    </>
  );
};

export default App;
