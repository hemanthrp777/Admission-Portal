import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ApplyPage from './pages/ApplyPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ScanPage from './pages/ScanPage';
import ScannerPage from './pages/ScannerPage';
import './index.css';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">🎓 AdmissionPortal</div>
      <div className="nav-links">
        <Link to="/">Apply Now</Link>
        <Link to="/scanner">📷 Scanner</Link>
        <Link to="/admin">Admin</Link>
        {user ? (
          <div className="nav-user">
            <span className="nav-email">{user.email}</span>
            <button className="btn-link nav-logout" onClick={handleSignOut}>Logout</button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <ApplyPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/scan/:id" element={<ScanPage />} />
        </Routes>
      </main>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
