import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiTruck } from 'react-icons/fi';
import { useUploadQueue } from '../context/UploadQueueContext';

function PathaoPayout() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ payoutDate: '', consignmentId: '', amountBDT: '', status: 'Paid' });
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [refreshOnSync, setRefreshOnSync] = useState(false);
  const { status, pendingCount, addToQueue } = useUploadQueue();

  const fetchData = () => {
    API.get('/pathao-payout')
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
    if (!form.payoutDate) return toast.error('Please select a payout date');
    if (!form.consignmentId.trim()) return toast.error('Please enter a consignment ID');
    if (!form.amountBDT || Number(form.amountBDT) <= 0) return toast.error('Please enter a valid amount');
    try {
      addToQueue('/pathao-payout', {
        date: form.payoutDate,
        consignmentId: form.consignmentId.trim(),
        amountBDT: Number(form.amountBDT),
      });
      toast.success('Saved locally and queued for upload');
      setForm({ payoutDate: '', consignmentId: '', amountBDT: '', status: 'Paid' });
      setRefreshOnSync(true);
    } catch (err) {
      toast.error('Failed to queue entry locally');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/pathao-payout/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const totalPaid = entries.filter(e => e.status === 'Paid').reduce((s, e) => s + e.amountBDT, 0);
  const totalPending = entries.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amountBDT, 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <FiTruck className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pathao Delivery Tracker</h1>
          <p className="text-sm text-slate-500">Track courier payouts and delivery status</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-400">৳{totalPaid.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-amber-600" />
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Total Pending</p>
          <p className="text-2xl font-bold text-yellow-400">৳{totalPending.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600" />
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900">৳{(totalPaid + totalPending).toLocaleString()}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Log Payout</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Payout Date</label>
            <input type="date" className="input-field" value={form.payoutDate} onChange={(e) => setForm({ ...form, payoutDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Consignment ID</label>
            <input type="text" className="input-field" placeholder="ORD-001" value={form.consignmentId} onChange={(e) => setForm({ ...form, consignmentId: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Amount (BDT)</label>
            <input type="number" className="input-field" placeholder="৳ 0" value={form.amountBDT} onChange={(e) => setForm({ ...form, amountBDT: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Status</label>
            <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FiPlus /> Log Payout
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
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Payout History</h3>
          <span className="text-gray-500 text-sm">{showHistory ? '▲ Hide' : '▼ Show'}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${showHistory ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payout Date</th>
                  <th>Consignment ID</th>
                  <th>Amount (BDT)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td></tr>
                ) : entries.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No payouts logged yet.</td></tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e._id}>
                      <td className="text-gray-300">{new Date(e.date).toLocaleDateString('en-GB')}</td>
                      <td><span className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded-md font-mono">{e.consignmentId}</span></td>
                      <td className="text-white font-semibold">৳{e.amountBDT.toLocaleString()}</td>
                      <td>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                          e.status === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {e.status === 'Paid' ? '● Paid' : '○ Pending'}
                        </span>
                      </td>
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

export default PathaoPayout;
