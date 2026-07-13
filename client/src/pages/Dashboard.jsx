import { useState, useEffect } from 'react';
import API from '../api/axios';
import TopSummary from '../components/TopSummary';
import { FiBarChart2, FiDollarSign, FiShoppingBag, FiPackage, FiTruck, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/ads-expense', icon: FiBarChart2, label: 'Ads Expense', desc: 'Track Meta & Google ad spend', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
  { to: '/dollar-wallet', icon: FiDollarSign, label: 'Dollar Wallet', desc: 'BDT to USD conversion log', gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
  { to: '/product-sourcing', icon: FiShoppingBag, label: 'Product Sourcing', desc: 'Product costs & batches', gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  { to: '/operating-costs', icon: FiPackage, label: 'Operating Costs', desc: 'Packaging & mobile recharge', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
  { to: '/pathao-payout', icon: FiTruck, label: 'Pathao Payout', desc: 'Delivery payouts & status', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
];

function Dashboard() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/summary')
      .then((res) => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>Live Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Command Center</h1>
        <p className="text-slate-600">{dateStr}</p>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 bg-dark-600 rounded w-20 mb-3" />
              <div className="h-6 bg-dark-600 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <TopSummary data={summary} />
      )}

      {/* Quick Links */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Navigation</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map(({ to, icon: Icon, label, desc, gradient, shadow }) => (
          <Link
            key={to}
            to={to}
            className={`glass-card p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl ${shadow} cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}>
                <Icon className="text-white text-xl" />
              </div>
              <FiArrowRight className="text-gray-600 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <h3 className="text-slate-900 font-semibold mb-1">{label}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
