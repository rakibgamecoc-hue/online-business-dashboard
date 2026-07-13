import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import AdsExpense from './pages/AdsExpense';
import DollarWallet from './pages/DollarWallet';
import ProductSourcing from './pages/ProductSourcing';
import OperatingCosts from './pages/OperatingCosts';
import PathaoPayout from './pages/PathaoPayout';
import Auth from './pages/Auth';
import API from './api/axios';
import { UploadQueueProvider } from './context/UploadQueueContext';
import UploadStatusBadge from './components/UploadStatusBadge';

const TOKEN_KEY = 'bd-analytics-token';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Auth onAuthSuccess={setUser} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#fff', color: '#111827', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' },
            success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
          }}
        />
      </>
    );
  }

  return (
    <UploadQueueProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Page content — offset by sidebar on desktop, padded bottom for mobile nav */}
      <main className="md:ml-64 min-h-screen">
        <div className="flex flex-col gap-4 p-4 sm:p-6 pb-24 md:pb-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-end">
            <UploadStatusBadge />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ads-expense" element={<AdsExpense />} />
            <Route path="/dollar-wallet" element={<DollarWallet />} />
            <Route path="/product-sourcing" element={<ProductSourcing />} />
            <Route path="/operating-costs" element={<OperatingCosts />} />
            <Route path="/pathao-payout" element={<PathaoPayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />

      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#fff', color: '#111827', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' },
          success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
        }}
      />
    </div>
    </UploadQueueProvider>
  );
}

export default App;
