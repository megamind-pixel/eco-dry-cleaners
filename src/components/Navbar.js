import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, Menu, X, LogOut, User, Settings, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout, notifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          
          <span>Eco <strong>Dry Cleaners</strong></span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>Home</Link>
          <Link to="/services" style={{ ...styles.link, ...(isActive('/services') ? styles.linkActive : {}) }}>Services</Link>
          <Link to="/tracking" style={{ ...styles.link, ...(isActive('/tracking') ? styles.linkActive : {}) }}>Track Order</Link>
          <Link to="/contact" style={{ ...styles.link, ...(isActive('/contact') ? styles.linkActive : {}) }}>Contact</Link>
        </div>

        <div style={styles.actions}>
          {user ? (
            <>
              {/* Notifications */}
              <div style={styles.notifWrapper}>
                <button style={styles.iconBtn} onClick={() => setNotifOpen(!notifOpen)}>
                  <Bell size={20} />
                  {unread > 0 && <span style={styles.badge}>{unread}</span>}
                </button>
                {notifOpen && (
                  <div style={styles.notifDropdown}>
                    <div style={styles.notifHeader}>
                      <span style={{ fontWeight: 600 }}>Notifications</span>
                    </div>
                    {notifications.length === 0 ? (
                      <div style={styles.notifEmpty}>No notifications yet</div>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div key={n.id} style={{ ...styles.notifItem, ...(n.read ? {} : styles.notifUnread) }}>
                          <div style={{ fontSize: 13 }}>{n.message}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div style={styles.notifWrapper}>
                <button style={styles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                  <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
                </button>
                {menuOpen && (
                  <div style={styles.dropdown}>
                    {user.role === 'admin' ? (
                      <Link to="/admin" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                        <ShieldCheck size={16} /> Admin Panel
                      </Link>
                    ) : (
                      <Link to="/dashboard" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                        <User size={16} /> Dashboard
                      </Link>
                    )}
                    <Link to="/profile" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                      <Settings size={16} /> Profile
                    </Link>
                    <button style={{ ...styles.dropItem, ...styles.dropDanger }} onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 1000 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: '#2D6A4F', textDecoration: 'none' },
  logoIcon: { fontSize: 26 },
  links: { display: 'flex', gap: 32 },
  link: { fontSize: 15, color: '#4B5563', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' },
  linkActive: { color: '#2D6A4F', fontWeight: 700 },
  actions: { display: 'flex', alignItems: 'center', gap: 16 },
  iconBtn: { position: 'relative', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' },
  badge: { position: 'absolute', top: -2, right: -2, background: '#EF4444', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  userBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 50 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#2D6A4F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 },
  notifWrapper: { position: 'relative' },
  notifDropdown: { position: 'absolute', right: 0, top: 48, width: 320, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)', overflow: 'hidden', zIndex: 1000 },
  notifHeader: { padding: '14px 18px', borderBottom: '1px solid #E5E7EB', fontSize: 15 },
  notifItem: { padding: '12px 18px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' },
  notifUnread: { background: '#F0FDF4' },
  notifEmpty: { padding: '24px 18px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 },
  dropdown: { position: 'absolute', right: 0, top: 48, width: 200, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)', overflow: 'hidden', zIndex: 1000 },
  dropItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', fontSize: 14, color: '#374151', cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'background 0.15s' },
  dropDanger: { color: '#EF4444' },
};
