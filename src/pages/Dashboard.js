import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Package, CheckCircle, Clock, DollarSign, Bell, Plus, ArrowRight, Truck } from 'lucide-react';

const STATUS_COLORS = {
  'Order Received': 'badge-blue',
  'Pickup Scheduled': 'badge-yellow',
  'Laundry Processing': 'badge-yellow',
  'Quality Check': 'badge-yellow',
  'Out for Delivery': 'badge-blue',
  'Delivered': 'badge-green',
};

const PAYMENT_COLORS = {
  'Pending': 'badge-yellow',
  'Paid': 'badge-green',
  'Failed': 'badge-red',
};

export default function Dashboard() {
  const { user, getUserOrders, notifications, markNotificationsRead } = useApp();
  const orders = getUserOrders();

  const activeOrders = orders.filter(o => o.status !== 'Delivered');
  const completedOrders = orders.filter(o => o.status === 'Delivered');
  const totalSpent = orders.filter(o => o.paymentStatus === 'Paid').reduce((a, b) => a + Number(b.total || 0), 0);
  const unread = notifications.filter(n => !n.read);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.welcome}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{ color: '#6B7280' }}>Here's what's happening with your laundry today.</p>
          </div>
          <Link to="/booking" className="btn btn-primary">
            <Plus size={18} /> New Booking
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: 'Total Orders', value: orders.length, icon: <Package size={22} />, color: '#2D6A4F' },
            { label: 'Active Orders', value: activeOrders.length, icon: <Truck size={22} />, color: '#F4A261' },
            { label: 'Completed', value: completedOrders.length, icon: <CheckCircle size={22} />, color: '#10B981' },
            { label: 'Total Spent', value: `KES ${totalSpent.toLocaleString()}`, icon: <DollarSign size={22} />, color: '#6366F1' },
          ].map(s => (
            <div key={s.label} className="card" style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.twoCol}>
          {/* Active Orders */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <h2 style={styles.sectionTitle}>Active Orders</h2>
              <Link to="/tracking" style={styles.viewAll}>View All <ArrowRight size={14} /></Link>
            </div>
            {activeOrders.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <h3>No active orders</h3>
                <Link to="/booking" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Book Now</Link>
              </div>
            ) : (
              activeOrders.slice(0, 4).map(order => (
                <div key={order.id} style={styles.orderItem}>
                  <div>
                    <div style={styles.orderId}>{order.id}</div>
                    <div style={styles.orderService}>{order.serviceType} — {order.package}</div>
                    <div style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gray'}`}>{order.status}</span>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>KES {order.total}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <h2 style={styles.sectionTitle}>Notifications</h2>
              {unread.length > 0 && (
                <button onClick={markNotificationsRead} style={styles.markReadBtn}>Mark all read</button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={48} />
                <h3>No notifications</h3>
              </div>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div key={n.id} style={{ ...styles.notifItem, ...(n.read ? {} : styles.notifUnread) }}>
                  <div style={{ fontSize: 8, color: n.read ? 'transparent' : '#2D6A4F', marginTop: 4 }}>●</div>
                  <div>
                    <div style={{ fontSize: 14 }}>{n.message}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order History Table */}
        {orders.length > 0 && (
          <div className="card" style={{ marginTop: 24 }}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 20 }}>Booking History</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Service</th>
                    <th>Package</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600, color: '#2D6A4F' }}>{order.id}</td>
                      <td>{order.serviceType}</td>
                      <td>{order.package}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>KES {order.total}</td>
                      <td><span className={`badge ${STATUS_COLORS[order.status] || 'badge-gray'}`}>{order.status}</span></td>
                      <td><span className={`badge ${PAYMENT_COLORS[order.paymentStatus] || 'badge-gray'}`}>{order.paymentStatus}</span></td>
                      <td>
                        {order.paymentStatus === 'Pending' && (
                          <Link to={`/payment/${order.id}`} className="btn btn-accent btn-sm">Pay</Link>
                        )}
                        {order.paymentStatus !== 'Pending' && (
                          <Link to="/tracking" className="btn btn-outline btn-sm">Track</Link>
                        )}
                      </td>
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
  page: { minHeight: '100vh', background: '#F8FAF8', padding: '32px 24px' },
  container: { maxWidth: 1200, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  welcome: { fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1B4332', marginBottom: 4 },
  statCard: { display: 'flex', flexDirection: 'column', gap: 8 },
  statIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a1a', fontWeight: 700 },
  statLabel: { fontSize: 13, color: '#6B7280' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  sectionTitle: { fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#1B4332' },
  viewAll: { display: 'flex', alignItems: 'center', gap: 4, color: '#2D6A4F', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  orderItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #F3F4F6' },
  orderId: { fontWeight: 700, fontSize: 14, color: '#2D6A4F' },
  orderService: { fontSize: 13, color: '#374151', marginTop: 2 },
  orderDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  notifItem: { display: 'flex', gap: 10, padding: '12px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'flex-start' },
  notifUnread: { background: '#F0FDF4', margin: '0 -24px', padding: '12px 24px' },
  markReadBtn: { background: 'none', border: 'none', color: '#2D6A4F', fontSize: 13, cursor: 'pointer', fontWeight: 600 },
};
