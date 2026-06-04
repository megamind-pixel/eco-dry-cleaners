import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function Register() {
  const { users, register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const res = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    if (res.success) {
      navigate('/dashboard');
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
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.sub}>Join thousands of happy customers</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" type="text" placeholder="Enter your full name"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" placeholder="Enter your email"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-control" type="tel" placeholder="+254 700 000 000"
              value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-control" type={showPass ? 'text' : 'password'}
                placeholder="Create a password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingRight: 48 }} />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input className="form-control" type="password" placeholder="Confirm your password"
              value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 3 }}></span> : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.switchLink}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #D8F3DC 0%, #F0FDF4 100%)', padding: 24 },
  card: { width: '100%', maxWidth: 440, padding: '40px 36px' },
  logoArea: { textAlign: 'center', marginBottom: 28 },
  logoIcon: { fontSize: 48, marginBottom: 8 },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1B4332', marginBottom: 6 },
  sub: { color: '#6B7280', fontSize: 15 },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' },
  switchLink: { color: '#2D6A4F', fontWeight: 600, textDecoration: 'none' },
};
