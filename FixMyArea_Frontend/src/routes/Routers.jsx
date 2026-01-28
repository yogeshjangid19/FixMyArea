

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home/Home';
// import Services from '../pages/Services';
import ReportIssue from '../components/ReportIssue/ReportIssue';
import ContactUs from '../components/ContactUs/ContactUs';
import CitizenDashboard from '../components/Dashboard/CitizenDashboard';
import MunicipalDashboard from '../components/Dashboard/MunicipalDashboard';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ role, children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) return <Navigate to="/home" />;
  if (user.role !== role) return <Navigate to="/home" />;

  return children;
};

const Routers = () => {

    
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/reportissue" element={<ReportIssue />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route
        path="/dashboard/citizen"
        element={
          <ProtectedRoute role="citizen">
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/municipal"
        element={
          <ProtectedRoute role="municipal">
            <MunicipalDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default Routers;