import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AdsExpense from './pages/AdsExpense';
import DollarWallet from './pages/DollarWallet';
import ProductSourcing from './pages/ProductSourcing';
import OperatingCosts from './pages/OperatingCosts';
import PathaoPayout from './pages/PathaoPayout';
import Auth from './pages/Auth';
import API from './api/axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('bd-analytics-token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('bd-analytics-token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-dark-800 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <Auth onAuthSuccess={setUser} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800 text-gray-100 md:flex">
      <Sidebar user={user} onLogout={() => {
        localStorage.removeItem('bd-analytics-token');
        setUser(null);
      }} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:ml-64 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ads-expense" element={<AdsExpense />} />
          <Route path="/dollar-wallet" element={<DollarWallet />} />
          <Route path="/product-sourcing" element={<ProductSourcing />} />
          <Route path="/operating-costs" element={<OperatingCosts />} />
          <Route path="/pathao-payout" element={<PathaoPayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
    </div>
  );
}

export default App;
