import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/Authcontext";
import Upload from "./pages/Upload";
import CourseDetailsForm from "./pages/CourseDetailForm";  // Import CourseDetailForm

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/course-details" 
            element={
              <ProtectedRoute>
                <CourseDetailsForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
