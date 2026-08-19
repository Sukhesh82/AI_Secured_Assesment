import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import StudentOverview from './pages/student/StudentOverview';
import StudentDashboard from './pages/student/StudentDashboard';
import ExamAttempt from './pages/student/ExamAttempt';
import StudentResults from './pages/student/StudentResults';
import AdminDashboard from './pages/admin/AdminDashboard';
import QuestionBank from './pages/admin/QuestionBank';
import ExamManager from './pages/admin/ExamManager';
import ProctoringDashboard from './pages/admin/ProctoringDashboard';
import GlobalMonitoring from './pages/admin/GlobalMonitoring';
import AuditLogs from './pages/admin/AuditLogs';

import Register from './pages/Register';
import Landing from './pages/Landing';
import Splash from './pages/Splash';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout component with Navbar and Sidebar
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col font-sans text-gray-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Full screen layout for exams
const ExamLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-dark font-sans text-gray-200">
      {children}
    </div>
  );
};

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Login />
          )
        } />
        
        <Route path="/register" element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Register />
          )
        } />

        <Route path="/splash" element={<Splash />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />

        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MainLayout>
              <StudentOverview />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/exams" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MainLayout>
              <StudentDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/student/results" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MainLayout>
              <StudentResults />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MainLayout>
              <div className="p-8 text-center text-gray-500">
                <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
                <p>Profile management and settings will be implemented in a future update.</p>
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/exam/:attemptId/attempt" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <ExamLayout>
              <ExamAttempt />
            </ExamLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/exams" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout>
              <ExamManager />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/questions" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout>
              <QuestionBank />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/monitoring" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout>
              <GlobalMonitoring />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/audit-logs" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout>
              <AuditLogs />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/proctoring/:examId" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout>
              <ProctoringDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="/" element={<Landing />} />
        
        <Route path="*" element={
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">404 - Not Found</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
