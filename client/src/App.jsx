import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import FabButton from './components/FabButton';
import Dashboard from './pages/Dashboard';
import AdsExpense from './pages/AdsExpense';
import DollarWallet from './pages/DollarWallet';
import ProductSourcing from './pages/ProductSourcing';
import OperatingCosts from './pages/OperatingCosts';
import PathaoPayout from './pages/PathaoPayout';
import Account from './pages/Account';
import Auth from './pages/Auth';
import API from './api/axios';
import { UploadQueueProvider } from './context/UploadQueueContext';
import UploadStatusBadge from './components/UploadStatusBadge';

const TOKEN_KEY = 'bd-analytics-token';

function App() {
  const location = useLocation();
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

  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const breadcrumbMap = {
    '/': 'Dashboard',
    '/ads-expense': 'Ads Expense',
    '/dollar-wallet': 'Dollar Wallet',
    '/product-sourcing': 'Product Sourcing',
    '/operating-costs': 'Operating Costs',
    '/pathao-payout': 'Pathao Payout',
  };

  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, segments) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        label: breadcrumbMap[path] || segment.replace(/-/g, ' '),
        path,
      };
    });

  return (
    <UploadQueueProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />

      {/* Page content — offset by sidebar on desktop when open, padded bottom for mobile nav */}
      <main className={`min-h-screen ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="flex flex-col gap-4 p-4 sm:p-6 xl:p-8 pb-24 md:pb-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((open) => !open)}
                  className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                >
                  {sidebarOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
                  <span>{sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}</span>
                </button>

                {/* Mobile-only greeting shown on home/dashboard */}
                {location.pathname === '/' && (
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-slate-900 bg-white border border-gray-200 shadow-sm sm:hidden">
                    <span>{(() => {
                      const hour = new Date().getHours();
                      const when = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
                      return `${when}${user?.name ? ', ' + user.name.split(' ')[0] : ''}`;
                    })()}</span>
                  </div>
                )}

                <UploadStatusBadge user={user} />
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
              {pathSegments.length > 0 && <span className="text-gray-400">/</span>}
              {pathSegments.map((segment, index) => (
                <span key={segment.path} className="inline-flex items-center gap-2">
                  {index < pathSegments.length - 1 ? (
                    <Link to={segment.path} className="text-blue-600 hover:text-blue-800">
                      {segment.label}
                    </Link>
                  ) : (
                    <span className="text-slate-900 font-semibold">{segment.label}</span>
                  )}
                  {index < pathSegments.length - 1 && <span className="text-gray-400">/</span>}
                </span>
              ))}
            </nav>
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ads-expense" element={<AdsExpense />} />
            <Route path="/dollar-wallet" element={<DollarWallet />} />
            <Route path="/product-sourcing" element={<ProductSourcing />} />
            <Route path="/operating-costs" element={<OperatingCosts />} />
            <Route path="/pathao-payout" element={<PathaoPayout />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Floating Action Button (mobile) */}
      <FabButton />

      {/* Mobile bottom nav */}
      <BottomNav user={user} />

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
