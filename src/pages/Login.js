import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const { users, login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(form.email, form.password);
    if (res.success) {
      // Check if user is admin based on returned user object
      const savedUser = JSON.parse(localStorage.getItem('edc_user'));
      if (savedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card">
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>🌿</div>
          <h1 style={styles.title}>Welcome Back!</h1>
          <p style={styles.sub}>Login to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Phone</label>
            <input className="form-control" type="email" placeholder="Enter your email or phone"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={styles.passWrap}>
              <input className="form-control" type={showPass ? 'text' : 'password'}
                placeholder="Enter your password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required
                style={{ paddingRight: 48 }} />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div style={styles.rememberRow}>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.remember} onChange={e => setForm({...form, remember: e.target.checked})} />
              Remember me
            </label>
            <a href="#!" style={styles.forgotLink}>Forgot Password?</a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, marginTop: 8 }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 3 }}></span> : <><LogIn size={18} /> Login</>}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account? <Link to="/register" style={styles.switchLink}>Sign Up</Link>
        </p>

        <div style={styles.divider}><span>or try demo</span></div>
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
          <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => { setForm({ email: 'admin@ecodrycleaners.com', password: 'admin123' }); }}>
            Fill Admin Credentials
          </button>
        </div>

        <div style={styles.trustBadges}>
          {['Secure', 'Fast', 'Reliable', 'Eco-Friendly'].map(b => (
            <span key={b} style={styles.trustBadge}>✓ {b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #D8F3DC 0%, #F0FDF4 100%)', padding: 24 },
  card: { width: '100%', maxWidth: 440, padding: '40px 36px' },
  logoArea: { textAlign: 'center', marginBottom: 32 },
  logoIcon: { fontSize: 48, marginBottom: 8 },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1B4332', marginBottom: 6 },
  sub: { color: '#6B7280', fontSize: 15 },
  passWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' },
  rememberRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' },
  forgotLink: { color: '#2D6A4F', fontSize: 14, fontWeight: 600, textDecoration: 'none' },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' },
  switchLink: { color: '#2D6A4F', fontWeight: 600, textDecoration: 'none' },
  divider: { textAlign: 'center', margin: '20px 0', position: 'relative', color: '#9CA3AF', fontSize: 13 },
  trustBadges: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' },
  trustBadge: { fontSize: 12, color: '#2D6A4F', background: '#D8F3DC', padding: '4px 10px', borderRadius: 50, fontWeight: 500 },
};
