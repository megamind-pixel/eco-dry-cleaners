import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Wind, CheckCircle, Truck, Zap, Star, ArrowRight, Package, Users, Award, Clock } from 'lucide-react';

const services = [
  { icon: <Wind size={28} />, name: 'Dry Cleaning', desc: 'Professional dry cleaning for delicate garments and suits.' },
  { icon: <Package size={28} />, name: 'Wash & Fold', desc: 'Complete laundry service — washed, dried, and neatly folded.' },
  { icon: <Shirt size={28} />, name: 'Ironing', desc: 'Crisp, wrinkle-free clothes ready to wear.' },
  { icon: <Truck size={28} />, name: 'Pickup & Delivery', desc: 'We come to you — free pickup and delivery from your door.' },
  { icon: <Zap size={28} />, name: 'Express Laundry', desc: 'Same-day turnaround for urgent laundry needs.' },
];

const steps = [
  { num: '01', title: 'Book Online', desc: 'Select your service, package, and preferred pickup date.' },
  { num: '02', title: 'Pickup Laundry', desc: 'We pick up your clothes from your door at the scheduled time.' },
  { num: '03', title: 'Cleaning Process', desc: 'Eco-friendly cleaning with premium products in our facility.' },
  { num: '04', title: 'Delivery', desc: 'We deliver clean, fresh clothes right back to your door.' },
];

const stats = [
  { icon: <Users size={24} />, value: '10,000+', label: 'Happy Customers' },
  { icon: <Package size={24} />, value: '50+', label: 'Daily Pickups' },
  { icon: <Award size={24} />, value: '99%', label: 'Satisfaction Rate' },
  { icon: <Clock size={24} />, value: '5+', label: 'Years of Service' },
];

const testimonials = [
  { name: 'Grace Kamau', text: 'Eco Dry Cleaners has made my life so much easier. On-time delivery and the clothes are always spotless!', rating: 5 },
  { name: 'David Ochieng', text: 'Amazing service! I love that they use eco-friendly products. My suits come back looking brand new.', rating: 5 },
  { name: 'Sarah Njoroge', text: 'Quick, reliable, and affordable. The express service saved me during a work trip.', rating: 5 },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🌿 Eco-Friendly Laundry</div>
          <h1 style={styles.heroTitle}>Eco-Friendly<br />Laundry Solutions<br /><em>Delivered to You</em></h1>
          <p style={styles.heroDesc}>Sustainable cleaning, exceptional care. Book your laundry service online and we'll handle the rest — pickup, cleaning, and delivery.</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
              Book a Service <ArrowRight size={18} />
            </Link>
            <Link to="/tracking" className="btn btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>
              Track Order
            </Link>
          </div>
          <div style={styles.heroFeatures}>
            {['Eco-Friendly Products', 'Free Pickup & Delivery', 'Same-Day Express'].map(f => (
              <span key={f} style={styles.heroFeature}><CheckCircle size={15} color="#52B788" /> {f}</span>
            ))}
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.heroImageInner}>
            <div style={styles.heroEmoji}>👗</div>
            <div style={styles.heroCircle}></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map(s => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Premium laundry care for every need</p>
          </div>
          <div style={styles.servicesGrid}>
            {services.map(s => (
              <div key={s.name} style={styles.serviceCard} className="card">
                <div style={styles.serviceIcon}>{s.icon}</div>
                <h3 style={styles.serviceTitle}>{s.name}</h3>
                <p style={styles.serviceDesc}>{s.desc}</p>
                <Link to="/booking" style={styles.serviceLink}>Book Now <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...styles.section, background: '#F0FDF4' }}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">Simple, convenient, and reliable</p>
          </div>
          <div style={styles.stepsGrid}>
            {steps.map((step, i) => (
              <div key={step.num} style={styles.stepCard}>
                <div style={styles.stepNum}>{step.num}</div>
                {i < steps.length - 1 && <div style={styles.stepLine}></div>}
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">What Customers Say</h2>
          </div>
          <div className="grid-3">
            {testimonials.map(t => (
              <div key={t.name} className="card" style={styles.testimonialCard}>
                <div style={{ color: '#F4A261', marginBottom: 12 }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={styles.testimonialText}>"{t.text}"</p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.testimonialAvatar}>{t.name[0]}</div>
                  <span style={{ fontWeight: 600 }}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', color: 'white', marginBottom: 16 }}>
            Ready for Fresh, Clean Clothes?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 32, fontSize: 16 }}>
            Book your first service today and get 20% off with code FIRSTWASH
          </p>
          <Link to="/booking" className="btn" style={{ background: 'white', color: '#1B4332', fontSize: 16, padding: '14px 36px' }}>
            Book Now — It's Easy <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)', color: 'white', padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, minHeight: 560, flexWrap: 'wrap' },
  heroContent: { maxWidth: 560 },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 50, fontSize: 14, marginBottom: 20 },
  heroTitle: { fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,5vw,3.2rem)', lineHeight: 1.2, marginBottom: 20, fontWeight: 700 },
  heroDesc: { fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 32 },
  heroFeatures: { display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' },
  heroFeature: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  heroImage: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroImageInner: { position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 120, position: 'relative', zIndex: 1 },
  heroCircle: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)' },
  statsSection: { background: 'white', padding: '32px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  statsGrid: { maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 },
  statCard: { textAlign: 'center', padding: 16 },
  statIcon: { color: '#2D6A4F', display: 'flex', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1B4332', fontWeight: 700 },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  section: { padding: '80px 24px' },
  container: { maxWidth: 1200, margin: '0 auto' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 },
  serviceCard: { textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  serviceIcon: { color: '#2D6A4F', display: 'flex', justifyContent: 'center', marginBottom: 16 },
  serviceTitle: { fontSize: 17, fontFamily: 'Playfair Display, serif', marginBottom: 8, color: '#1B4332' },
  serviceDesc: { fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 16 },
  serviceLink: { color: '#2D6A4F', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, position: 'relative' },
  stepCard: { textAlign: 'center', position: 'relative' },
  stepNum: { fontFamily: 'Playfair Display, serif', fontSize: 48, color: '#52B788', fontWeight: 700, opacity: 0.5, marginBottom: 12 },
  stepLine: { display: 'none' },
  stepTitle: { fontSize: 18, fontFamily: 'Playfair Display, serif', color: '#1B4332', marginBottom: 8 },
  stepDesc: { fontSize: 14, color: '#6B7280', lineHeight: 1.6 },
  testimonialCard: { padding: 28 },
  testimonialText: { fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: 12 },
  testimonialAvatar: { width: 40, height: 40, borderRadius: '50%', background: '#2D6A4F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  ctaSection: { background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', padding: '80px 24px', textAlign: 'center' },
};
