import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Package, Shirt, Zap, Truck, ArrowRight, CheckCircle } from 'lucide-react';

const SERVICES = [
  {
    icon: <Wind size={36} />, name: 'Dry Cleaning', price: 'From KES 500',
    desc: 'Professional dry cleaning using eco-friendly solvents. Perfect for suits, dresses, coats, and delicate fabrics.',
    features: ['Stain removal', 'Deodorizing', 'Fabric care treatment', 'Pressed & hung'],
  },
  {
    icon: <Package size={36} />, name: 'Wash & Fold', price: 'From KES 400',
    desc: 'Complete laundry service from washing to neatly folded and bagged. Great for everyday clothes.',
    features: ['Machine washed', 'Tumble dried', 'Neatly folded', 'Bagged & delivered'],
  },
  {
    icon: <Shirt size={36} />, name: 'Ironing', price: 'From KES 300',
    desc: 'Professional ironing for crisp, wrinkle-free clothes ready to wear.',
    features: ['Steam ironing', 'Hung on hangers', 'Per piece pricing', 'Business shirts welcome'],
  },
  {
    icon: <Zap size={36} />, name: 'Express Laundry', price: 'From KES 1,200',
    desc: 'Same-day turnaround for urgent laundry needs. Drop off by 10AM, receive by 6PM.',
    features: ['Same-day service', 'Priority handling', 'All garment types', 'SMS notification'],
  },
  {
    icon: <Truck size={36} />, name: 'Pickup & Delivery', price: 'KES 150 flat',
    desc: 'We come to you! Free pickup and delivery from your home or office anywhere in Nairobi.',
    features: ['Doorstep pickup', 'Real-time tracking', 'Flexible scheduling', 'Secure packaging'],
  },
];

export default function Services() {
  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Our Services</h1>
        <p style={styles.heroSub}>Professional eco-friendly laundry care for every need</p>
      </div>
      <div style={styles.container}>
        {SERVICES.map((s, i) => (
          <div key={s.name} className="card" style={{ ...styles.serviceCard, ...(i % 2 === 1 ? styles.altCard : {}) }}>
            <div style={styles.serviceIconBox}>{s.icon}</div>
            <div style={styles.serviceBody}>
              <div style={styles.servicePrice}>{s.price}</div>
              <h2 style={styles.serviceName}>{s.name}</h2>
              <p style={styles.serviceDesc}>{s.desc}</p>
              <div style={styles.features}>
                {s.features.map(f => (
                  <span key={f} style={styles.feature}><CheckCircle size={14} color="#52B788" /> {f}</span>
                ))}
              </div>
              <Link to="/booking" className="btn btn-primary" style={{ marginTop: 20 }}>
                Book {s.name} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: 'white', padding: '60px 24px', textAlign: 'center' },
  heroTitle: { fontFamily: 'Playfair Display, serif', fontSize: 40, marginBottom: 12 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  container: { maxWidth: 900, margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: 24 },
  serviceCard: { display: 'flex', gap: 28, alignItems: 'flex-start', padding: '28px 32px' },
  altCard: { background: '#F0FDF4' },
  serviceIconBox: { width: 80, height: 80, borderRadius: 20, background: '#D8F3DC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D6A4F', flexShrink: 0 },
  serviceBody: { flex: 1 },
  servicePrice: { fontSize: 13, fontWeight: 700, color: '#F4A261', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  serviceName: { fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1B4332', marginBottom: 10 },
  serviceDesc: { color: '#4B5563', lineHeight: 1.7, fontSize: 15, marginBottom: 12 },
  features: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  feature: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151', background: '#F3F4F6', padding: '4px 10px', borderRadius: 50 },
};
