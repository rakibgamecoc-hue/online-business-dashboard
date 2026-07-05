import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';

function ProductSourcing() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ date: '', productName: '', batchNumber: '', unitCost: '', packagingCost: '', totalBDT: '' });
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const fetchData = () => {
    API.get('/product-sourcing')
      .then((res) => setEntries(res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

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
    if (!form.date || !form.productName || !form.batchNumber || !form.totalBDT) return toast.error('Fill all fields');
    try {
      await API.post('/product-sourcing', {
        ...form,
        unitCost: Number(form.unitCost),
        packagingCost: Number(form.packagingCost),
        totalBDT: Number(form.totalBDT),
      });
      toast.success('Product sourcing entry added!');
      setForm({ date: '', productName: '', batchNumber: '', unitCost: '', packagingCost: '', totalBDT: '' });
      fetchData();
    } catch {
      toast.error('Failed to add');
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

  const totalCost = entries.reduce((s, e) => s + e.totalBDT, 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
          <FiShoppingBag className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Product Sourcing</h1>
          <p className="text-sm text-gray-400">Track product costs, batches & packaging expenses</p>
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
                ) : entries.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">No entries yet.</td></tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e._id}>
                      <td className="text-gray-300">{new Date(e.date).toLocaleDateString('en-GB')}</td>
                      <td className="text-white font-medium">{e.productName}</td>
                      <td><span className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded-md font-mono">{e.batchNumber}</span></td>
                      <td className="text-gray-300">৳{e.unitCost.toLocaleString()}</td>
                      <td className="text-gray-300">৳{e.packagingCost.toLocaleString()}</td>
                      <td className="text-amber-400 font-semibold">৳{e.totalBDT.toLocaleString()}</td>
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
