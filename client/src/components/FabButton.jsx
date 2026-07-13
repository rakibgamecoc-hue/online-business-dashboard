import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useUploadQueue } from '../context/UploadQueueContext';
import toast from 'react-hot-toast';

const sectionConfig = {
  '/ads-expense': {
    label: 'Add Ads Expense',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'platform', type: 'select', label: 'Platform', options: ['Meta', 'Google'], required: true },
      { name: 'amountBDT', type: 'number', label: 'Amount (BDT)', required: true },
    ],
    defaults: { date: '', platform: 'Meta', amountBDT: '' },
    endpoint: '/ads-expense',
    validate: (form) => {
      if (!form.date) return 'Please select a date';
      if (!form.amountBDT || Number(form.amountBDT) <= 0) return 'Please enter a valid amount';
      return null;
    },
    buildPayload: (form) => ({ ...form, amountBDT: Number(form.amountBDT) }),
  },
  '/dollar-wallet': {
    label: 'Add Credit Entry',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'bdtSpent', type: 'number', label: 'BDT Spent', required: true },
      { name: 'usdReceived', type: 'number', label: 'USD Received', required: true },
    ],
    defaults: { date: '', bdtSpent: '', usdReceived: '' },
    endpoint: '/dollar-wallet',
    validate: (form) => {
      if (!form.date) return 'Please select a date';
      if (!form.bdtSpent || Number(form.bdtSpent) <= 0) return 'Please enter BDT Spent';
      if (!form.usdReceived || Number(form.usdReceived) <= 0) return 'Please enter USD Received';
      return null;
    },
    buildPayload: (form) => ({
      date: form.date,
      amountUSD: Number(form.usdReceived),
      totalBDT: Number(form.bdtSpent),
      rateBDT: Number(form.usdReceived) > 0 ? parseFloat((Number(form.bdtSpent) / Number(form.usdReceived)).toFixed(2)) : 0,
    }),
  },
  '/product-sourcing': {
    label: 'Add Product',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'productName', type: 'text', label: 'Product Name', required: true },
      { name: 'batchNumber', type: 'text', label: 'Batch #' },
      { name: 'unitCost', type: 'number', label: 'Unit Cost (BDT)' },
      { name: 'packagingCost', type: 'number', label: 'Packaging Cost (BDT)' },
    ],
    defaults: { date: '', productName: '', batchNumber: '', unitCost: '0', packagingCost: '0' },
    endpoint: '/product-sourcing',
    validate: (form) => {
      if (!form.date) return 'Please select a date';
      if (!form.productName.trim()) return 'Please enter product name';
      return null;
    },
    buildPayload: (form) => ({
      date: form.date,
      itemName: form.productName,
      quantity: Number(form.batchNumber) || 1,
      costBDT: (Number(form.unitCost) || 0) + (Number(form.packagingCost) || 0),
    }),
  },
  '/operating-costs': {
    label: 'Add Operating Cost',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'category', type: 'select', label: 'Category', options: ['Poly Bags', 'Cartoons', 'Mobile Recharge', 'Other'], required: true },
      { name: 'description', type: 'text', label: 'Description' },
      { name: 'amountBDT', type: 'number', label: 'Amount (BDT)', required: true },
    ],
    defaults: { date: '', category: 'Poly Bags', description: '', amountBDT: '' },
    endpoint: '/operating-costs',
    validate: (form) => {
      if (!form.date) return 'Please select a date';
      if (!form.amountBDT || Number(form.amountBDT) <= 0) return 'Please enter a valid amount';
      return null;
    },
    buildPayload: (form) => ({ ...form, amountBDT: Number(form.amountBDT) }),
  },
  '/pathao-payout': {
    label: 'Log Payout',
    fields: [
      { name: 'payoutDate', type: 'date', label: 'Payout Date', required: true },
      { name: 'consignmentId', type: 'text', label: 'Consignment ID', required: true },
      { name: 'amountBDT', type: 'number', label: 'Amount (BDT)', required: true },
      { name: 'status', type: 'select', label: 'Status', options: ['Paid', 'Pending'], required: true },
    ],
    defaults: { payoutDate: '', consignmentId: '', amountBDT: '', status: 'Paid' },
    endpoint: '/pathao-payout',
    validate: (form) => {
      if (!form.payoutDate) return 'Please select a payout date';
      if (!form.consignmentId.trim()) return 'Please enter a consignment ID';
      if (!form.amountBDT || Number(form.amountBDT) <= 0) return 'Please enter a valid amount';
      return null;
    },
    buildPayload: (form) => ({
      date: form.payoutDate,
      consignmentId: form.consignmentId.trim(),
      amountBDT: Number(form.amountBDT),
      status: form.status,
    }),
  },
};

// Only show on section pages (not dashboard)
const fabRoutes = ['/ads-expense', '/dollar-wallet', '/product-sourcing', '/operating-costs', '/pathao-payout'];

function FabButton({ onEntryAdded }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({});
  const panelRef = useRef(null);
  const { addToQueue } = useUploadQueue();

  const config = sectionConfig[location.pathname];
  const showFab = fabRoutes.includes(location.pathname) && config;

  // Reset form when route changes or modal opens
  useEffect(() => {
    if (isOpen && config) {
      setForm({ ...config.defaults });
    }
  }, [isOpen, location.pathname]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!config) return;
    const error = config.validate(form);
    if (error) {
      toast.error(error);
      return;
    }
    const payload = config.buildPayload(form);
    addToQueue(config.endpoint, payload);
    toast.success('Saved and queued for upload!');
    setIsOpen(false);
    // Trigger re-fetch in the page
    if (onEntryAdded) onEntryAdded();
  };

  if (!showFab) return null;

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? 'bg-gray-700 rotate-45 shadow-lg'
            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 hover:shadow-blue-600/50'
        }`}
        aria-label={isOpen ? 'Close' : 'Add new entry'}
      >
        {isOpen ? (
          <FiX className="text-white text-xl" />
        ) : (
          <FiPlus className="text-white text-xl" />
        )}
      </button>

      {/* Quick-add Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center pb-20 sm:pb-0">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div
            ref={panelRef}
            className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto animate-slide-up pb-16 sm:pb-8"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-200 rounded-t-2xl z-10">
              <h2 className="text-base font-semibold text-gray-900">{config.label}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {config.fields.map((field) => (
                <div key={field.name}>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={form[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.label}
                      value={form[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors duration-150 shadow-sm"
              >
                <FiPlus className="w-4 h-4" />
                {config.label}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FabButton;
