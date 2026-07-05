import { NavLink } from 'react-router-dom';
import { FiHome, FiBarChart2, FiDollarSign, FiShoppingBag, FiPackage, FiTruck } from 'react-icons/fi';

const investLinks = [
  { to: '/ads-expense', icon: FiBarChart2, label: 'Ads Expense' },
  { to: '/dollar-wallet', icon: FiDollarSign, label: 'Dollar Wallet' },
  { to: '/product-sourcing', icon: FiShoppingBag, label: 'Product Sourcing' },
  { to: '/operating-costs', icon: FiPackage, label: 'Operating Costs' },
];

const earnLinks = [
  { to: '/pathao-payout', icon: FiTruck, label: 'Pathao Payout' },
];

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
    }`;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-dark-900 border-r border-dark-600/50 flex flex-col z-50">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-dark-600/50">
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
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={linkClass}>
          <FiHome className="text-lg" />
          <span>Dashboard</span>
        </NavLink>

        <div className="pt-6 pb-2">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">Invest</p>
        </div>
        {investLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="text-lg" />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="pt-6 pb-2">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">Earn</p>
        </div>
        {earnLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="text-lg" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-dark-600/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            O
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Owner</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
