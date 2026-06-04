import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Package, Truck, CheckCircle, Clock, Star, MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const STAGES = [
  { name: 'Order Received', icon: <Package size={22} />, desc: 'Your order has been received and confirmed.' },
  { name: 'Pickup Scheduled', icon: <Clock size={22} />, desc: 'A driver has been assigned for your pickup.' },
  { name: 'Laundry Processing', icon: <Star size={22} />, desc: 'Your clothes are being professionally cleaned.' },
  { name: 'Quality Check', icon: <CheckCircle size={22} />, desc: 'Quality inspection in progress.' },
  { name: 'Out for Delivery', icon: <Truck size={22} />, desc: 'Your order is on the way!' },
  { name: 'Delivered', icon: <MapPin size={22} />, desc: 'Successfully delivered to your door.' },
];

export default function Tracking() {
  const { orders } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const search = () => {
    if (!query.trim()) return;
    const found = orders.find(o => o.orderId.toLowerCase() === query.trim().toLowerCase());
    if (found) {
      setResult(found);
      setError('');
    } else {
      setResult(null);
      setError('No order found with that ID. Please check and try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Track Your Order</h1>
          <p style={{ color: '#6B7280' }}>Enter your Order ID to check your laundry status</p>
        </div>

        {/* Search */}
        <div className="card" style={styles.searchCard}>
          <div style={styles.searchRow}>
            <input className="form-control" placeholder="Enter Order ID (e.g. ECO123456)"
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              style={{ flex: 1, fontSize: 16, padding: '14px 18px' }} />
            <button className="btn btn-primary" onClick={search} style={{ padding: '14px 28px', fontSize: 16 }}>
              <Search size={18} /> Track Order
            </button>
          </div>
          {error && <div className="alert alert-error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
        </div>

        {result && (
          <div style={styles.resultArea}>
            {/* Order Info */}
            <div className="card" style={styles.orderInfoCard}>
              <div style={styles.orderTop}>
                <div>
                  <div style={styles.orderId}>Order #{result.orderId}</div>
                  <div style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
                    Placed on {new Date(result.createdAt).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.statusBadge}>{result.status}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>
                    Estimated Delivery: <strong>{result.deliveryDate}</strong>
                  </div>
                </div>
              </div>
              <div style={styles.orderMeta}>
                {[
                  ['Service', result.serviceType],
                  ['Package', result.package],
                  ['Quantity', result.quantity + ' kg/pieces'],
                  ['Pickup Date', result.pickupDate],
                  ['Total', 'KES ' + result.total],
                  ['Payment', result.paymentStatus],
                ].map(([k, v]) => (
                  <div key={k} style={styles.metaItem}>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Tracking Map */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ ...styles.trackTitle, marginBottom: 0 }}>Live Delivery Tracking</h2>
                <div style={{ fontSize: 12, color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Navigation size={14} /> GPS Active
                </div>
              </div>
              <div style={styles.mapContainer}>
                <MapContainer center={[-1.286389, 36.817223]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 12 }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[-1.286389, 36.817223]}>
                    <Popup>Your order's current location</Popup>
                  </Marker>
                  <Marker position={[-1.2921, 36.8219]}>
                    <Popup>Driver location</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 12 }}>
                <strong>Current Status:</strong> {result.status}. Your driver is approximately 10 minutes away from your location.
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="card">
              <h2 style={styles.trackTitle}>Tracking Progress</h2>
              <div style={styles.timeline}>
                {STAGES.map((stage, i) => {
                  const statusIdx = result.statusIndex ?? 0;
                  const done = i <= statusIdx;
                  const active = i === statusIdx;
                  return (
                    <div key={stage.name} style={styles.timelineItem}>
                      <div style={styles.timelineLeft}>
                        <div style={{ ...styles.dot, ...(done ? styles.dotDone : {}), ...(active ? styles.dotActive : {}) }}>
                          {done ? stage.icon : <div style={styles.dotInner}></div>}
                        </div>
                        {i < STAGES.length - 1 && <div style={{ ...styles.line, ...(done ? styles.lineDone : {}) }}></div>}
                      </div>
                      <div style={{ ...styles.stageContent, opacity: done ? 1 : 0.45 }}>
                        <div style={{ ...styles.stageName, ...(active ? styles.stageActive : {}) }}>{stage.name}</div>
                        <div style={styles.stageDesc}>{stage.desc}</div>
                        {active && (
                          <div style={styles.activePulse}>● In Progress</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div style={styles.progressBarWrapper}>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${((result.statusIndex ?? 0) / (STAGES.length - 1)) * 100}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>Order Placed</span>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>Delivered</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Orders Quick Access */}
        {orders.length > 0 && (
          <div className="card" style={styles.myOrders}>
            <h3 style={styles.trackTitle}>Recent Orders</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ background: '#F8FAF8' }}>
                    {['Order ID', 'Service', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 13, color: '#6B7280', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o._id} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2D6A4F', fontSize: 14 }}>{o.orderId}</td>
                      <td style={{ padding: '12px 14px', fontSize: 14 }}>{o.serviceType}</td>
                      <td style={{ padding: '12px 14px' }}><span style={styles.miniBadge}>{o.status}</span></td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => { setQuery(o.orderId); setResult(o); window.scrollTo({top:0}); }}>
                          Track
                        </button>
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
  page: { background: '#F8FAF8', minHeight: '100vh', padding: '40px 24px' },
  container: { maxWidth: 860, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 32 },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#1B4332', marginBottom: 8 },
  searchCard: { marginBottom: 32 },
  searchRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  resultArea: { display: 'flex', flexDirection: 'column', gap: 24 },
  orderInfoCard: { padding: 24 },
  orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  orderId: { fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#1B4332' },
  statusBadge: { background: '#D8F3DC', color: '#1B4332', padding: '6px 14px', borderRadius: 50, fontSize: 13, fontWeight: 700 },
  orderMeta: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, background: '#F8FAF8', padding: 16, borderRadius: 10 },
  metaItem: {},
  mapContainer: { height: 300, background: '#E5E7EB', borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB' },
  trackTitle: { fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#1B4332', marginBottom: 24 },
  timeline: { display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 32 },
  timelineItem: { display: 'flex', gap: 16 },
  timelineLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48 },
  dot: { width: 44, height: 44, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexShrink: 0, zIndex: 1 },
  dotDone: { background: '#2D6A4F', color: 'white' },
  dotActive: { background: '#2D6A4F', color: 'white', boxShadow: '0 0 0 6px rgba(82,183,136,0.2)' },
  dotInner: { width: 12, height: 12, borderRadius: '50%', background: '#9CA3AF' },
  line: { width: 2, flex: 1, minHeight: 32, background: '#E5E7EB', margin: '2px 0' },
  lineDone: { background: '#52B788' },
  stageContent: { paddingBottom: 24, flex: 1 },
  stageName: { fontWeight: 600, fontSize: 15, color: '#1a1a1a', marginBottom: 2, paddingTop: 10 },
  stageActive: { color: '#2D6A4F' },
  stageDesc: { fontSize: 13, color: '#6B7280' },
  activePulse: { fontSize: 12, color: '#52B788', fontWeight: 600, marginTop: 4 },
  progressBarWrapper: { marginTop: 8 },
  progressBarBg: { height: 8, background: '#E5E7EB', borderRadius: 50, overflow: 'hidden' },
  progressBarFill: { height: '100%', background: 'linear-gradient(90deg, #2D6A4F, #52B788)', borderRadius: 50, transition: 'width 0.5s ease' },
  myOrders: { marginTop: 24 },
  miniBadge: { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 50, background: '#D8F3DC', color: '#1B4332' },
};
