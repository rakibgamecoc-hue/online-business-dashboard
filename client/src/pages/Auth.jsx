import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiLogIn, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios';

function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        toast.error('Please fill in all fields');
        return;
      }
      if (form.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    } else {
      if (!form.email.trim() || !form.password) {
        toast.error('Please enter your email and password');
        return;
      }
    }

    try {
      setLoading(true);
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' 
        ? { email: form.email.trim().toLowerCase(), password: form.password }
        : { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password };

      const { data } = await API.post(endpoint, payload);
      
      localStorage.setItem('bd-analytics-token', data.token);
      toast.success(mode === 'login' ? `Welcome back, ${data.user.name}` : 'Account created successfully');
      onAuthSuccess(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800 px-4 py-10 text-gray-100">
      <div className="w-full max-w-md rounded-3xl border border-dark-600/60 bg-dark-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="BD Analytics Logo" className="mx-auto mb-3 w-16 h-16 object-cover rounded-2xl shadow-lg" />
          <h2 className="text-2xl font-semibold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'login' ? 'Sign in to continue to your dashboard.' : 'Register to access the dashboard.'}
          </p>
          <div className="mt-3 bg-dark-700/50 rounded-lg p-3 text-xs text-left text-gray-300 border border-dark-600/50">
            <span className="block mb-1 text-cyan-400 font-medium">Tips:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Use a valid email format (e.g., name@example.com).</li>
              <li>Passwords must be at least 6 characters long.</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <label className="block">
              <span className="mb-2 block text-sm text-gray-300">Full Name</span>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter your name"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm text-gray-300">Email</span>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your email"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-gray-300">Password</span>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your password"
              />
            </div>
          </label>

          {mode === 'register' && (
            <label className="block">
              <span className="mb-2 block text-sm text-gray-300">Confirm Password</span>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Re-enter your password"
                />
              </div>
            </label>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-400">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
          <button
            type="button"
            className="font-medium text-cyan-400 transition hover:text-cyan-300"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
