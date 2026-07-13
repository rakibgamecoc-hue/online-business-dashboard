import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHome, FiBarChart2, FiDollarSign, FiTruck, FiGrid, FiShoppingBag, FiPackage, FiX, FiLogOut } from 'react-icons/fi';

const mainLinks = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/ads-expense', icon: FiBarChart2, label: 'Ads' },
  { to: '/dollar-wallet', icon: FiDollarSign, label: 'Wallet' },
  { to: '/pathao-payout', icon: FiTruck, label: 'Pathao' },
];

const moreLinks = [
  { to: '/product-sourcing', icon: FiShoppingBag, label: 'Product Sourcing' },
  { to: '/operating-costs', icon: FiPackage, label: 'Operating Costs' },
];

function BottomNav({ user }) {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] font-medium transition-colors ${
      isActive ? 'text-blue-600' : 'text-gray-500'
    }`;

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex">
        {mainLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
        {/* More button */}
        <button
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] font-medium text-gray-500 transition-colors"
        >
          <FiGrid className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>

      {/* More sheet overlay */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">More Sections</h3>
              <button onClick={() => setShowMore(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Profile summary for mobile */}
            {user && (
              <div className="flex items-center gap-3 mb-4 px-1">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button onClick={() => { setShowMore(false); navigate('/account'); }} className="text-sm text-gray-500 underline">Profile</button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {moreLinks.map(({ to, icon: Icon, label }) => (
                <button
                  key={to}
                  onClick={() => { navigate(to); setShowMore(false); }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-left"
                >
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                </button>
              ))}

              {/* Logout action for mobile */}
              <button
                onClick={() => {
                  localStorage.removeItem('bd-analytics-token');
                  setShowMore(false);
                  toast.success('Logged out');
                  navigate('/', { replace: true });
                  setTimeout(() => window.location.reload(), 120);
                }}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-left col-span-2 text-red-600"
              >
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                  <FiLogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BottomNav;
