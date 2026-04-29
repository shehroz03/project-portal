import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Ideas from './pages/Ideas';
import SubmitRequest from './pages/SubmitRequest';
import Dashboard from './pages/Dashboard';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/signup"     element={<Signup />} />
              <Route path="/ideas"      element={<Ideas />} />
              <Route path="/submit"     element={<SubmitRequest />} />
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/admin"      element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
