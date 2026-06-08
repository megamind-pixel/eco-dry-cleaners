import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, DollarSign, TrendingUp, Settings, FileText, BarChart2, LogOut } from 'lucide-react';

const STAGES = ['Order Received','Pickup Scheduled','Laundry Processing','Quality Check','Out for Delivery','Delivered'];
const COLORS = ['#2D6A4F','#52B788','#F4A261','#6366F1','#10B981','#EF4444'];

const STATUS_COLORS = {
  'Order Received': 'badge-blue', 'Pickup Scheduled': 'badge-yellow',
  'Laundry Processing': 'badge-yellow', 'Quality Check': 'badge-yellow',
  'Out for Delivery': 'badge-blue', 'Delivered': 'badge-green',
};

export default function Admin() {
  const { user, orders, users, updateOrderStatus, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1B4332' }}>Access Denied</h2>
        <p style={{ color: '#6B7280' }}>Admin access only.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Login as Admin</button>
      </div>
    );
  }

  const totalRevenue = orders.filter(o => o.paymentStatus === 'Paid').reduce((a, b) => a + Number(b.total || 0), 0);
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;


  const revenueByService = orders.reduce((acc, o) => {
    if (o.paymentStatus === 'Paid') {
      acc[o.serviceType] = (acc[o.serviceType] || 0) + Number(o.total || 0);
    }
    return acc;
  }, {});
  const revenueData = Object.entries(revenueByService).map(([name, value]) => ({ name, value }));


  const serviceDistrib = orders.reduce((acc, o) => {
    acc[o.serviceType] = (acc[o.serviceType] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(serviceDistrib).map(([name, value]) => ({ name, value }));

  const filtered = orders.filter(o =>
    (filter === '' || o.orderId.includes(filter) || o.customerName?.toLowerCase().includes(filter.toLowerCase())) &&
    (statusFilter === '' || o.status === statusFilter)
  );

  const handleLogout = () => { logout(); navigate('/'); };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={18} /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign size={18} /> },
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>🌿 <strong>Eco Admin</strong></div>
        <nav>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ ...styles.sideItem, ...(tab === t.id ? styles.sideItemActive : {}) }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button style={{ ...styles.sideItem, marginTop: 'auto', color: '#EF4444' }} onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </nav>
        <div style={styles.adminInfo}>
          <div style={styles.adminAvatar}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
            <div style={{ fontSize: 11, color: '#A7C4B5' }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>{tabs.find(t => t.id === tab)?.label}</h1>
            <p style={{ color: '#6B7280', fontSize: 14 }}>Welcome back, Admin</p>
          </div>
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div>
            <div className="grid-4" style={{ marginBottom: 28 }}>
              {[
                { label: 'Total Bookings', value: orders.length, icon: <Package size={22} />, color: '#2D6A4F' },
                { label: 'Active Orders', value: activeOrders, icon: <TrendingUp size={22} />, color: '#F4A261' },
                { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: <DollarSign size={22} />, color: '#6366F1' },
                { label: 'Customers', value: users.length, icon: <Users size={22} />, color: '#10B981' },
              ].map(s => (
                <div key={s.label} className="card" style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: s.color + '18', color: s.color }}>{s.icon}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={styles.chartsGrid}>
              <div className="card">
                <h3 style={styles.chartTitle}>Revenue by Service</h3>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={revenueData}>
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip formatter={(v) => `KES ${v}`} />
                      <Bar dataKey="value" fill="#2D6A4F" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="empty-state"><p>No revenue data yet</p></div>}
              </div>
              <div className="card">
                <h3 style={styles.chartTitle}>Service Distribution</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={e => e.name}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="empty-state"><p>No order data yet</p></div>}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ marginTop: 24 }}>
              <h3 style={styles.chartTitle}>Recent Activity</h3>
              {orders.length === 0 ? (
                <div className="empty-state"><Package size={40} /><h3>No orders yet</h3></div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Service</th><th>Status</th><th>Amount</th></tr></thead>
                    <tbody>
                      {orders.slice(-5).reverse().map(o => (
                        <tr key={o._id}>
                          <td style={{ fontWeight: 700, color: '#2D6A4F' }}>{o.orderId}</td>
                          <td>{o.customerName}</td>
                          <td>{o.serviceType}</td>
                          <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                          <td style={{ fontWeight: 600 }}>KES {o.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <div style={styles.filterBar}>
              <input className="form-control" placeholder="Search by Order ID or Customer..."
                value={filter} onChange={e => setFilter(e.target.value)}
                style={{ maxWidth: 320 }} />
              <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ maxWidth: 200 }}>
                <option value="">All Statuses</option>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {filtered.length === 0 ? (
              <div className="empty-state card"><Package size={48} /><h3>No orders found</h3></div>
            ) : (
              <div className="card table-wrapper">
                <table>
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Service</th><th>Package</th><th>Pickup</th><th>Amount</th><th>Status</th><th>Update Status</th></tr></thead>
                  <tbody>
                    {filtered.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontWeight: 700, color: '#2D6A4F', fontSize: 13 }}>{o.orderId}</td>
                        <td style={{ fontSize: 13 }}>{o.customerName}</td>
                        <td style={{ fontSize: 13 }}>{o.serviceType}</td>
                        <td style={{ fontSize: 13 }}>{o.package}</td>
                        <td style={{ fontSize: 13 }}>{o.pickupDate}</td>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>KES {o.total}</td>
                        <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-gray'}`} style={{ fontSize: 11 }}>{o.status}</span></td>
                        <td>
                          <select value={o.statusIndex ?? 0} onChange={e => {
                            const val = Number(e.target.value);
                            updateOrderStatus(o.orderId, STAGES[val], val);
                          }}
                            style={{ fontSize: 12, padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer', background: 'white' }}>
                            {STAGES.map((s, i) => <option key={s} value={i}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {tab === 'customers' && (
          <div>
            {users.length === 0 ? (
              <div className="empty-state card"><Users size={48} /><h3>No customers registered yet</h3></div>
            ) : (
              <div className="card table-wrapper">
                <table>
                  <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Orders</th></tr></thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id}>
                        <td style={{ color: '#9CA3AF' }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 600, color: '#2D6A4F' }}>
                          {orders.filter(o => o.userId === u._id).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {tab === 'payments' && (
          <div>
            <div className="grid-3" style={{ marginBottom: 24 }}>
              {[
                { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, color: '#2D6A4F' },
                { label: 'Paid Orders', value: orders.filter(o => o.paymentStatus === 'Paid').length, color: '#10B981' },
                { label: 'Pending Payment', value: orders.filter(o => o.paymentStatus === 'Pending').length, color: '#F4A261' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, color: s.color, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card table-wrapper">
              <table>
                <thead><tr><th>Order ID</th><th>Customer</th><th>Service</th><th>Method</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 700, color: '#2D6A4F' }}>{o.orderId}</td>
                      <td>{o.customerName}</td>
                      <td>{o.serviceType}</td>
                      <td>M-Pesa</td>
                      <td style={{ fontWeight: 600 }}>KES {o.total}</td>
                      <td>
                        <span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: '#6B7280' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: 240, background: '#1B4332', color: 'white', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh' },
  sidebarLogo: { fontSize: 18, padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 },
  sideItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: 'none', border: 'none', color: '#A7C4B5', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all 0.2s' },
  sideItemActive: { background: 'rgba(255,255,255,0.12)', color: 'white', borderRight: '3px solid #52B788' },
  adminInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' },
  adminAvatar: { width: 36, height: 36, borderRadius: '50%', background: '#52B788', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  main: { flex: 1, padding: '28px 32px', background: '#F8FAF8', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#1B4332' },
  statCard: { display: 'flex', flexDirection: 'column', gap: 8 },
  statIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700 },
  statLabel: { fontSize: 13, color: '#6B7280' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  chartTitle: { fontFamily: 'Playfair Display, serif', fontSize: 17, color: '#1B4332', marginBottom: 16 },
  filterBar: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
};
