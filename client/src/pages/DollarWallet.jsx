import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Accordion from '../components/Accordion';
import { FiPlus, FiTrash2, FiDollarSign } from 'react-icons/fi';

function DollarWallet() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ date: '', bdtSpent: '', usdReceived: '', rate: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    API.get('/dollar-wallet')
      .then((res) => setEntries(res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleFormChange = (field, value) => {
    const updated = { ...form, [field]: value };
    // Auto-calculate rate
    if (field === 'bdtSpent' || field === 'usdReceived') {
      const bdt = field === 'bdtSpent' ? Number(value) : Number(updated.bdtSpent);
      const usd = field === 'usdReceived' ? Number(value) : Number(updated.usdReceived);
      if (bdt > 0 && usd > 0) {
        updated.rate = (bdt / usd).toFixed(2);
      }
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.bdtSpent || !form.usdReceived) return toast.error('Fill all fields');
    try {
      await API.post('/dollar-wallet', {
        date: form.date,
        bdtSpent: Number(form.bdtSpent),
        usdReceived: Number(form.usdReceived),
        rate: Number(form.rate),
      });
      toast.success('Dollar wallet entry added!');
      setForm({ date: '', bdtSpent: '', usdReceived: '', rate: '' });
      fetchData();
    } catch {
      toast.error('Failed to add');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/dollar-wallet/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const totalBDT = entries.reduce((s, e) => s + e.bdtSpent, 0);
  const totalUSD = entries.reduce((s, e) => s + e.usdReceived, 0);
  const avgRate = totalUSD > 0 ? (totalBDT / totalUSD).toFixed(2) : 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <FiDollarSign className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dollar Wallet Tracker</h1>
          <p className="text-sm text-gray-400">Track BDT to USD conversions for ad payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600" />
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Total BDT Spent</p>
          <p className="text-2xl font-bold text-white">৳{totalBDT.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Total USD Received</p>
          <p className="text-2xl font-bold text-white">${totalUSD.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-600" />
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Average Rate</p>
          <p className="text-2xl font-bold text-white">৳{avgRate}/USD</p>
        </div>
      </div>

      {/* Accordion with Credit History */}
      <Accordion title="Credit History" badge={`${entries.length} entries`}>
        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Add Credit Entry</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Date</label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => handleFormChange('date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">BDT Spent</label>
              <input type="number" className="input-field" placeholder="৳ 0" value={form.bdtSpent} onChange={(e) => handleFormChange('bdtSpent', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">USD Received</label>
              <input type="number" className="input-field" placeholder="$ 0" value={form.usdReceived} onChange={(e) => handleFormChange('usdReceived', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Rate (auto)</label>
              <input type="text" className="input-field bg-dark-900/50" placeholder="Auto" value={form.rate} readOnly />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FiPlus /> Add
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>BDT Spent</th>
                <th>USD Received</th>
                <th>Rate</th>
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
                    <td className="text-white font-semibold">৳{e.bdtSpent.toLocaleString()}</td>
                    <td className="text-emerald-400 font-semibold">${e.usdReceived.toLocaleString()}</td>
                    <td className="text-amber-400">৳{e.rate}</td>
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
      </Accordion>
    </div>
  );
}

export default DollarWallet;
