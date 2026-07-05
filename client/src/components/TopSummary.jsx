import { FiBarChart2, FiTrendingUp, FiShoppingBag, FiPackage, FiDollarSign, FiClock } from 'react-icons/fi';

const formatBDT = (amount) => {
  return '৳' + Number(amount || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const cards = [
  { key: 'totalAds', label: 'Ads Spend', icon: FiBarChart2, color: 'rose', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
  { key: 'totalRevenue', label: 'Revenue (Paid)', icon: FiTrendingUp, color: 'emerald', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { key: 'totalSourcing', label: 'Product Cost', icon: FiShoppingBag, color: 'amber', gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  { key: 'totalOps', label: 'Operating Cost', icon: FiPackage, color: 'violet', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
  { key: 'netProfit', label: 'Net Profit', icon: FiDollarSign, color: 'cyan', gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
  { key: 'totalPending', label: 'Pending Payout', icon: FiClock, color: 'yellow', gradient: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/20' },
];

function TopSummary({ data }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map(({ key, label, icon: Icon, gradient, shadow }) => (
        <div
          key={key}
          className={`glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl ${shadow}`}
        >
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`} />
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}>
              <Icon className="text-white text-sm" />
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-xl font-bold ${key === 'netProfit' && (data?.[key] || 0) < 0 ? 'text-rose-400' : 'text-white'}`}>
            {formatBDT(data?.[key])}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TopSummary;
