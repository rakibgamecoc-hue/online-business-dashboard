import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AdsExpense from './pages/AdsExpense';
import DollarWallet from './pages/DollarWallet';
import ProductSourcing from './pages/ProductSourcing';
import OperatingCosts from './pages/OperatingCosts';
import PathaoPayout from './pages/PathaoPayout';

function App() {
  return (
    <div className="min-h-screen bg-dark-800 text-gray-100 md:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:ml-64 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ads-expense" element={<AdsExpense />} />
          <Route path="/dollar-wallet" element={<DollarWallet />} />
          <Route path="/product-sourcing" element={<ProductSourcing />} />
          <Route path="/operating-costs" element={<OperatingCosts />} />
          <Route path="/pathao-payout" element={<PathaoPayout />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
    </div>
  );
}

export default App;
