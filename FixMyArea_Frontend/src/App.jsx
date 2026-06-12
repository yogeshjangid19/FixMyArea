import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ReportIssue from './pages/ReportIssue';
import IssueFeed from './pages/IssueFeed';
import CitizenDashboard from './pages/CitizenDashboard';
import MunicipalDashboard from './pages/MunicipalDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppInner = () => {
  return (
    <div className="page-bg min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/issues" element={
          <ProtectedRoute roles={['municipal', 'admin']}>
            <IssueFeed />
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute roles={['citizen']}>
            <ReportIssue />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/citizen" element={
          <ProtectedRoute roles={['citizen']}>
            <CitizenDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/municipal" element={
          <ProtectedRoute roles={['municipal']}>
            <MunicipalDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
