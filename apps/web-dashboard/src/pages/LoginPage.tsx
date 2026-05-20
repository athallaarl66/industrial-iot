import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-industrial-bg)]">
      <div className="industrial-panel p-8 rounded-2xl w-full max-w-md border border-[var(--color-industrial-border)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[var(--color-industrial-text)] tracking-tight mb-2">
            Industrial IoT
          </h1>
          <p className="text-[var(--color-industrial-text-muted)] text-sm font-medium">
            Command Center Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xs font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-industrial-panel)] border border-[var(--color-industrial-border)] rounded-xl text-[var(--color-industrial-text)] placeholder:text-[var(--color-industrial-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-industrial-panel)] border border-[var(--color-industrial-border)] rounded-xl text-[var(--color-industrial-text)] placeholder:text-[var(--color-industrial-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-rose-950/50 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Access Command Center'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-[var(--color-industrial-text-muted)] font-medium">
            Default admin: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
