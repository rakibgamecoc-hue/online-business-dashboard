import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { useUploadQueue } from '../context/UploadQueueContext';

function AdsExpense() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ date: '', platform: 'Meta', amountBDT: '' });
  const [loading, setLoading] = useState(true);
  const [refreshOnSync, setRefreshOnSync] = useState(false);
  const { status, pendingCount, addToQueue } = useUploadQueue();

  const fetchData = () => {
    API.get('/ads-expense')
      .then((res) => setEntries(res.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load data — check your connection'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (refreshOnSync && status === 'synced' && pendingCount === 0) {
      fetchData();
      setRefreshOnSync(false);
    }
  }, [refreshOnSync, status, pendingCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date) return toast.error('Please select a date');
    if (!form.amountBDT || Number(form.amountBDT) <= 0) return toast.error('Please enter a valid amount');
    try {
      addToQueue('/ads-expense', { ...form, amountBDT: Number(form.amountBDT) });
      toast.success('Saved locally and queued for upload');
      setForm({ date: '', platform: 'Meta', amountBDT: '' });
      setRefreshOnSync(true);
    } catch (err) {
      toast.error('Failed to queue entry locally');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/ads-expense/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const totalSpend = entries.reduce((sum, e) => sum + e.amountBDT, 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
          <FiBarChart2 className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ads Expense</h1>
          <p className="text-sm text-slate-500">Track Meta & Google ad spend in BDT</p>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card p-5 mb-6 inline-flex items-center gap-4">
        <span className="text-sm text-gray-400">Total Spend:</span>
        <span className="text-xl font-bold text-rose-400">৳{totalSpend.toLocaleString()}</span>
        <span className="text-xs text-gray-500">({entries.length} entries)</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Date</label>
            <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Platform</label>
            <select className="input-field" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option value="Meta">Meta (Facebook)</option>
              <option value="Google">Google Ads</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Amount (BDT)</label>
            <input type="number" className="input-field" placeholder="৳ 0" value={form.amountBDT} onChange={(e) => setForm({ ...form, amountBDT: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FiPlus /> Add Entry
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="glass-card">
        <div className="px-6 py-4 border-b border-dark-600/30">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Transaction History</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Platform</th>
                <th>Amount (BDT)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No entries yet. Add your first expense above.</td></tr>
              ) : (
                entries.map((e) => (
                  <tr key={e._id}>
                    <td className="text-slate-700">{new Date(e.date).toLocaleDateString('en-GB')}</td>
                    <td>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        e.platform === 'Meta'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>{e.platform}</span>
                    </td>
                    <td className="text-slate-900 font-semibold">৳{e.amountBDT.toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleDelete(e._id)} className="btn-danger flex items-center gap-1">
                        <FiTrash2 className="text-xs" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdsExpense;
