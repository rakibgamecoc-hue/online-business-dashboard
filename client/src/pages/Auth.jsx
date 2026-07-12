import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios';

function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirm(false);
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
      const payload =
        mode === 'login'
          ? { email: form.email.trim().toLowerCase(), password: form.password }
          : { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password };

      const { data } = await API.post(endpoint, payload);

      localStorage.setItem('bd-analytics-token', data.token);
      toast.success(mode === 'login' ? `Welcome back, ${data.user.name}!` : 'Account created! Welcome aboard!');
      onAuthSuccess(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800 px-4 py-8 text-gray-100">
      <div className="w-full max-w-sm sm:max-w-md rounded-3xl border border-dark-600/60 bg-dark-900/80 p-5 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur">

        {/* Header */}
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="BD Analytics Logo"
            className="mx-auto mb-3 w-16 h-16 object-cover rounded-2xl shadow-lg"
          />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {mode === 'login' ? 'Sign in to your personal dashboard.' : 'Register to start tracking your business.'}
          </p>
        </div>

        {/* Tips */}
        <div className="mb-5 bg-dark-700/50 rounded-xl p-3 text-xs text-gray-300 border border-dark-600/50">
          <span className="block mb-1 text-cyan-400 font-semibold">📋 Tips</span>
          <ul className="list-disc pl-4 space-y-1">
            <li>Use a valid email format — e.g., <span className="text-gray-200">name@example.com</span></li>
            <li>Password must be at least <span className="text-gray-200">6 characters</span> long</li>
            {mode === 'register' && <li>Confirm password must match your password exactly</li>}
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name field — register only */}
          {mode === 'register' && (
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field pl-10 w-full"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field pl-10 w-full"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10 w-full"
                placeholder="Enter your password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
              </button>
            </div>
          </div>

          {/* Confirm Password — register only */}
          {mode === 'register' && (
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10 w-full"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processing...
              </span>
            ) : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="mt-5 text-center text-sm text-gray-400">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
