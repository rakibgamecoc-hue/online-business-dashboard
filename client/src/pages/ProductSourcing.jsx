import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useUploadQueue } from '../context/UploadQueueContext';

function ProductSourcing() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ date: '', productName: '', batchNumber: '', unitCost: '', packagingCost: '', totalBDT: '' });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshOnSync, setRefreshOnSync] = useState(false);
  const { status, pendingCount, addToQueue } = useUploadQueue();

  const fetchData = () => {
    setHasError(false);
    API.get('/product-sourcing')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEntries(res.data);
        } else {
          console.error('Unexpected product sourcing response', res.data);
          setEntries([]);
          setHasError(true);
          toast.error('Unexpected response while loading product sourcing data.');
        }
      })
      .catch((err) => {
        console.error('Product sourcing fetch failed', err);
        setHasError(true);
        toast.error(err.response?.data?.message || 'Failed to load — check your connection');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (refreshOnSync && status === 'synced' && pendingCount === 0) {
      fetchData();
      setRefreshOnSync(false);
    }
  }, [refreshOnSync, status, pendingCount]);

  const handleFormChange = (field, value) => {
    const updated = { ...form, [field]: value };
    if (field === 'unitCost' || field === 'packagingCost') {
      const unit = field === 'unitCost' ? Number(value) : Number(updated.unitCost);
      const pkg = field === 'packagingCost' ? Number(value) : Number(updated.packagingCost);
      updated.totalBDT = (unit + pkg).toString();
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date) return toast.error('Please select a date');
    if (!form.productName.trim()) return toast.error('Please enter product name');
    if (!form.totalBDT || Number(form.totalBDT) <= 0) return toast.error('Please enter a valid cost');
    try {
      addToQueue('/product-sourcing', {
        date: form.date,
        itemName: form.productName,
        quantity: Number(form.batchNumber) || 1,
        costBDT: Number(form.totalBDT),
      });
      toast.success('Saved locally and queued for upload');
      setForm({ date: '', productName: '', batchNumber: '', unitCost: '', packagingCost: '', totalBDT: '' });
      setRefreshOnSync(true);
    } catch (err) {
      toast.error('Failed to queue entry locally');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/product-sourcing/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const safeEntries = Array.isArray(entries) ? entries : [];
  const totalCost = safeEntries.reduce((s, e) => s + (Number(e.costBDT) || 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
          <FiShoppingBag className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Sourcing</h1>
          <p className="text-sm text-slate-500">Track product costs, batches & packaging expenses</p>
        </div>
      </div>

      <div className="glass-card p-5 mb-6 inline-flex items-center gap-4">
        <span className="text-sm text-gray-400">Total Product Cost:</span>
        <span className="text-xl font-bold text-amber-400">৳{totalCost.toLocaleString()}</span>
        <span className="text-xs text-gray-500">({entries.length} entries)</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Date</label>
            <input type="date" className="input-field" value={form.date} onChange={(e) => handleFormChange('date', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Product Name</label>
            <input type="text" className="input-field" placeholder="Product name" value={form.productName} onChange={(e) => handleFormChange('productName', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Batch Number</label>
            <input type="text" className="input-field" placeholder="BATCH-001" value={form.batchNumber} onChange={(e) => handleFormChange('batchNumber', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Unit Cost (BDT)</label>
            <input type="number" className="input-field" placeholder="৳ 0" value={form.unitCost} onChange={(e) => handleFormChange('unitCost', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Packaging Cost (BDT)</label>
            <input type="number" className="input-field" placeholder="৳ 0" value={form.packagingCost} onChange={(e) => handleFormChange('packagingCost', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Total (BDT)</label>
            <input type="number" className="input-field bg-dark-900/50" placeholder="Auto" value={form.totalBDT} readOnly />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FiPlus /> Add Product
            </button>
          </div>
        </div>
      </form>

      {/* Toggle History */}
      <div className="glass-card">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-dark-600/20 transition-colors duration-200"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Transaction History</h3>
          <span className="text-gray-500 text-sm">{showHistory ? '▲ Hide' : '▼ Show'}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${showHistory ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Batch</th>
                  <th>Unit Cost</th>
                  <th>Packaging</th>
                  <th>Total (BDT)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading...</td></tr>
                ) : hasError ? (
                  <tr><td colSpan="7" className="text-center py-8 text-red-500">Unable to load entries. Please refresh.</td></tr>
                ) : safeEntries.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">No entries yet.</td></tr>
                ) : (
                  safeEntries.map((e) => (
                    <tr key={e._id || e.id || `${e.date}-${e.itemName}` }>
                      <td className="text-slate-700">{new Date(e.date).toLocaleDateString('en-GB')}</td>
                      <td className="text-slate-900 font-medium">{e.productName}</td>
                      <td><span className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded-md font-mono">{e.batchNumber}</span></td>
                      <td className="text-gray-300">৳{Number(e.unitCost || 0).toLocaleString()}</td>
                      <td className="text-gray-300">৳{Number(e.packagingCost || 0).toLocaleString()}</td>
                      <td className="text-amber-400 font-semibold">৳{Number(e.costBDT || 0).toLocaleString()}</td>
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

export default ProductSourcing;
