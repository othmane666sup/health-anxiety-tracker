import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }} dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'var(--color-accent)' }}>
            <span className="text-white text-2xl font-bold">ي</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>يومفلو</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-sub)' }}>سجل دخولك لمتابعة يومك</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="input w-full px-4 py-3 rounded-xl text-sm"
                placeholder="example@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                كلمة المرور
              </label>
              <input
                type="password"
                className="input w-full px-4 py-3 rounded-xl text-sm"
                placeholder="••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                dir="ltr"
              />
            </div>

            {error && (
              <div className="text-sm text-center py-2 px-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 rounded-xl text-sm font-semibold"
              disabled={loading}
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-sub)' }}>
          ليس لديك حساب؟{' '}
          <Link to="/register" style={{ color: 'var(--color-accent)' }} className="font-semibold">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}
