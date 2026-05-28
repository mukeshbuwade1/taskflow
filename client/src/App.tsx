import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import HighPriorityTasks from './pages/HighPriorityTasks';
import OverdueTasks from './pages/OverdueTasks';
import Settings from './pages/Settings';
import AdminUsers from './pages/admin/AdminUsers';

const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <AdminRoute>
    <AppLayout>{children}</AppLayout>
  </AdminRoute>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard"    element={<ProtectedPage><Dashboard /></ProtectedPage>} />
            <Route path="/my-tasks"     element={<ProtectedPage><MyTasks /></ProtectedPage>} />
            <Route path="/high-priority"element={<ProtectedPage><HighPriorityTasks /></ProtectedPage>} />
            <Route path="/overdue"      element={<ProtectedPage><OverdueTasks /></ProtectedPage>} />
            <Route path="/settings"     element={<ProtectedPage><Settings /></ProtectedPage>} />

            <Route path="/admin/users"  element={<AdminPage><AdminUsers /></AdminPage>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '8px', fontSize: '14px' },
            success: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
