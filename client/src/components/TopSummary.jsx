import { Link } from 'react-router-dom';
import { FiBarChart2, FiTrendingUp, FiShoppingBag, FiPackage, FiDollarSign, FiClock } from 'react-icons/fi';

const formatBDT = (amount) => {
  return '৳' + Number(amount || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const cards = [
  { key: 'totalAdsExpense', label: 'Ads Spend', icon: FiBarChart2, route: '/ads-expense', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
  { key: 'totalPaid', label: 'Revenue (Paid)', icon: FiTrendingUp, route: '/pathao-payout', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { key: 'totalProductSourcing', label: 'Product Cost', icon: FiShoppingBag, route: '/product-sourcing', gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  { key: 'totalOperatingCost', label: 'Operating Cost', icon: FiPackage, route: '/operating-costs', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
  { key: 'netProfit', label: 'Net Profit', icon: FiDollarSign, route: '/', gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
  { key: 'totalPending', label: 'Pending Payout', icon: FiClock, route: '/pathao-payout', gradient: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/20' },
];

function TopSummary({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
      {cards.map(({ key, label, icon: Icon, route, gradient, shadow }) => (
        <Link
          key={key}
          to={route}
          className={`glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl ${shadow}`}
        >
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`} />
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}>
              <Icon className="text-white text-sm" />
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-xl font-bold ${key === 'netProfit' && (data?.[key] || 0) < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatBDT(data?.[key])}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default TopSummary;
