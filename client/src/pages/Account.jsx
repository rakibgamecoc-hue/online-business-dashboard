import { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => toast.error('Failed to load account info'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bd-analytics-token');
    toast.success('Logged out');
    setTimeout(() => window.location.reload(), 120);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Account</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Name</span>
            <span className="text-sm font-medium text-slate-900">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium text-slate-900">{user?.email}</span>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handleLogout} className="btn-danger">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Account;
