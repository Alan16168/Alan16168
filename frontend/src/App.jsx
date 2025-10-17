import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Forms from './pages/Forms';
import BackgroundCheck from './pages/BackgroundCheck';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function PrivateRoute({ children, requirePremium = false, requireAdmin = false }) {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  if (requirePremium && !user?.hasPremiumAccess && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const { i18n } = useTranslation();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Home />} />
        <Route path="chat" element={<Chat />} />
        <Route path="forms" element={<Forms />} />
        <Route path="background-check" element={
          <PrivateRoute requirePremium={true}>
            <BackgroundCheck />
          </PrivateRoute>
        } />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={
          <PrivateRoute requireAdmin={true}>
            <AdminPanel />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
