import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { Navbar } from './shared/components/Navbar';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { LoginPage } from './domains/auth/LoginPage';
import { RegisterPage } from './domains/company/RegisterPage';
import { JobsPage } from './domains/job/JobsPage';
import { JobDetailPage } from './domains/job/JobDetailPage';
import { MatchPage } from './domains/match/MatchPage';
import { DashboardPage } from './domains/dashboard/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
          <Route path="/match" element={<ProtectedRoute><MatchPage /></ProtectedRoute>} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
