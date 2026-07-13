import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiPackage } from 'react-icons/fi';
import { useUploadQueue } from '../context/UploadQueueContext';

const categoryColors = {
  'Poly Bags': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Cartoons': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Mobile Recharge': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

function OperatingCosts() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ date: '', category: 'Poly Bags', description: '', amountBDT: '' });
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshOnSync, setRefreshOnSync] = useState(false);
  const { status, pendingCount, addToQueue } = useUploadQueue();

  const fetchData = () => {
    API.get('/operating-costs')
      .then((res) => setEntries(res.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load — check your connection'))
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
      addToQueue('/operating-costs', { ...form, amountBDT: Number(form.amountBDT) });
      toast.success('Saved locally and queued for upload');
      setForm({ date: '', category: 'Poly Bags', description: '', amountBDT: '' });
      setRefreshOnSync(true);
    } catch (err) {
      toast.error('Failed to queue entry locally');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/operating-costs/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const totalOps = entries.reduce((s, e) => s + e.amountBDT, 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
          <FiPackage className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Operating Costs</h1>
          <p className="text-sm text-gray-400">Packaging materials, mobile recharge & other costs</p>
        </div>
      </div>

      <div className="glass-card p-5 mb-6 inline-flex items-center gap-4">
        <span className="text-sm text-gray-400">Total Operating Costs:</span>
        <span className="text-xl font-bold text-violet-400">৳{totalOps.toLocaleString()}</span>
        <span className="text-xs text-gray-500">({entries.length} entries)</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Add Operating Cost</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Date</label>
            <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Category</label>
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="Poly Bags">Poly Bags</option>
              <option value="Cartoons">Cartoons</option>
              <option value="Mobile Recharge">Mobile Recharge</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Description</label>
            <input type="text" className="input-field" placeholder="Optional note" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Amount (BDT)</label>
            <input type="number" className="input-field" placeholder="৳ 0" value={form.amountBDT} onChange={(e) => setForm({ ...form, amountBDT: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FiPlus /> Add
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="glass-card">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-dark-600/20 transition-colors duration-200"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Cost History</h3>
          <span className="text-gray-500 text-sm">{showHistory ? '▲ Hide' : '▼ Show'}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${showHistory ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount (BDT)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td></tr>
                ) : entries.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No entries yet.</td></tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e._id}>
                      <td className="text-gray-300">{new Date(e.date).toLocaleDateString('en-GB')}</td>
                      <td>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${categoryColors[e.category]}`}>
                          {e.category}
                        </span>
                      </td>
                      <td className="text-gray-400">{e.description || '—'}</td>
                      <td className="text-violet-400 font-semibold">৳{e.amountBDT.toLocaleString()}</td>
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
    </div>
  );
}

export default OperatingCosts;
