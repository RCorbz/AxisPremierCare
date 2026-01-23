import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/Home';
import Login from './components/auth/Login';
import Portal from './pages/Portal';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-background-dark min-h-screen text-white font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/portal" element={<Portal />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}