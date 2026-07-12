import { NavLink } from 'react-router-dom';
import { FiHome, FiBarChart2, FiDollarSign, FiShoppingBag, FiPackage, FiTruck, FiLogOut } from 'react-icons/fi';

const investLinks = [
  { to: '/ads-expense', icon: FiBarChart2, label: 'Ads Expense' },
  { to: '/dollar-wallet', icon: FiDollarSign, label: 'Dollar Wallet' },
  { to: '/product-sourcing', icon: FiShoppingBag, label: 'Product Sourcing' },
  { to: '/operating-costs', icon: FiPackage, label: 'Operating Costs' },
];

const earnLinks = [
  { to: '/pathao-payout', icon: FiTruck, label: 'Pathao Payout' },
];

function Sidebar({ user, onLogout }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
    }`;

  return (
    <aside className="w-full bg-dark-900 border-b border-dark-600/50 md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r md:flex md:flex-col z-50">
      {/* Brand */}
      <div className="px-4 py-4 md:px-6 md:py-6 border-b border-dark-600/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <FiBarChart2 className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">BD Analytics</h1>
            <p className="text-xs text-gray-500">Business Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 md:px-4 md:py-6 overflow-x-auto md:overflow-y-auto">
        <div className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
          <NavLink to="/" end className={linkClass}>
            <FiHome className="text-lg" />
            <span>Dashboard</span>
          </NavLink>

          <div className="w-full pt-4 pb-2 md:pt-6">
            <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">Invest</p>
          </div>
          {investLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon className="text-lg" />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="w-full pt-4 pb-2 md:pt-6">
            <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">Earn</p>
          </div>
          {earnLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon className="text-lg" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-3 md:px-4 md:py-4 border-t border-dark-600/50">
        <div className="flex items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'Administrator'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-dark-700 hover:text-white"
            title="Logout"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
