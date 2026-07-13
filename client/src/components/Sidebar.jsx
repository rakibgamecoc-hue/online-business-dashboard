import { NavLink } from 'react-router-dom';
import { FiHome, FiBarChart2, FiDollarSign, FiShoppingBag, FiPackage, FiTruck, FiLogOut } from 'react-icons/fi';

const navSections = [
  { label: null, links: [{ to: '/', icon: FiHome, label: 'Dashboard' }] },
  {
    label: 'Invest',
    links: [
      { to: '/ads-expense', icon: FiBarChart2, label: 'Ads Expense' },
      { to: '/dollar-wallet', icon: FiDollarSign, label: 'Dollar Wallet' },
      { to: '/product-sourcing', icon: FiShoppingBag, label: 'Product Sourcing' },
      { to: '/operating-costs', icon: FiPackage, label: 'Operating Costs' },
    ],
  },
  {
    label: 'Earn',
    links: [{ to: '/pathao-payout', icon: FiTruck, label: 'Pathao Payout' }],
  },
];

function Sidebar({ user, onLogout }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r border-gray-200 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200">
        <img src="/logo.png" alt="BD Analytics" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">BD Analytics</p>
          <p className="text-xs text-gray-500">Business Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navSections.map((section, si) => (
          <div key={si} className={si > 0 ? 'pt-4' : ''}>
            {section.label && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {section.label}
              </p>
            )}
            {section.links.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'O'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Owner'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
