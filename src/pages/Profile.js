import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, login, users } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [saved, setSaved] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    login(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Profile Settings</h1>
        <div style={styles.layout}>
          {/* Profile Card */}
          <div className="card" style={styles.profileCard}>
            <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userEmail}>{user.email}</div>
            <div style={styles.userRole}>
              <span className="badge badge-green">{user.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}</span>
            </div>
            <div style={styles.memberSince}>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })}</div>
          </div>

          {/* Edit Form */}
          <div className="card">
            <h2 style={styles.formTitle}>Edit Profile</h2>
            {saved && <div className="alert alert-success"><CheckCircle size={18} /> Profile updated successfully!</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label><User size={14} style={{ marginRight: 4 }} />Full Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label><Mail size={14} style={{ marginRight: 4 }} />Email Address</label>
                <input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label><Phone size={14} style={{ marginRight: 4 }} />Phone Number</label>
                <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary"><Save size={18} /> Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#F8FAF8', minHeight: '100vh', padding: '40px 24px' },
  container: { maxWidth: 900, margin: '0 auto' },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1B4332', marginBottom: 28 },
  layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' },
  profileCard: { textAlign: 'center', padding: 32 },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: '#2D6A4F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, margin: '0 auto 16px' },
  userName: { fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#1B4332', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  userRole: { marginBottom: 12 },
  memberSince: { fontSize: 12, color: '#9CA3AF' },
  formTitle: { fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#1B4332', marginBottom: 20 },
};
