import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Share2, MessageCircle, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div>
            <div style={styles.logo}> Eco <strong>Dry Cleaners</strong></div>
            <p style={styles.desc}>Eco-friendly laundry solutions delivered to your doorstep. Sustainable cleaning, exceptional care.</p>
            <div style={styles.socials}>
              <a href="#!" style={styles.social}><Share2 size={18} /></a>
              <a href="#!" style={styles.social}><MessageCircle size={18} /></a>
              <a href="#!" style={styles.social}><Camera size={18} /></a>
            </div>
          </div>
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            {[['/', 'Home'], ['/services', 'Services'], ['/booking', 'Book Service'], ['/tracking', 'Track Order'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} style={styles.footLink}>{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={styles.colTitle}>Services</h4>
            {['Dry Cleaning', 'Wash & Fold', 'Ironing', 'Express Laundry', 'Pickup & Delivery'].map(s => (
              <span key={s} style={{ ...styles.footLink, display: 'block', cursor: 'default' }}>{s}</span>
            ))}
          </div>
          <div>
            <h4 style={styles.colTitle}>Contact</h4>
            <div style={styles.contactItem}><MapPin size={15} /> 123 Ottawa, Ontario, Canada</div>
            <div style={styles.contactItem}><Phone size={15} /> +1 (343) 553-8919</div>
            <div style={styles.contactItem}><Mail size={15} /> clean@ecodrycleaners.ca</div>
            <div style={styles.contactItem}><Clock size={15} /> Mon–Sat: 7:00AM – 8:00PM</div>
          </div>
        </div>
        <div style={styles.bottom}>
          <span>© 2026 Eco Dry Cleaners. All rights reserved.</span>
          <span>Convenience and quality</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#1B4332', color: 'white', marginTop: 60 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '48px 24px 24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 },
  logo: { fontSize: 20, marginBottom: 12 },
  desc: { fontSize: 14, color: '#A7C4B5', lineHeight: 1.6, marginBottom: 20 },
  socials: { display: 'flex', gap: 12 },
  social: { width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' },
  colTitle: { fontFamily: 'Playfair Display, serif', fontSize: 16, marginBottom: 16, color: '#52B788' },
  footLink: { display: 'block', fontSize: 14, color: '#A7C4B5', marginBottom: 8, textDecoration: 'none', transition: 'color 0.2s' },
  contactItem: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#A7C4B5', marginBottom: 10, lineHeight: 1.4 },
  bottom: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#A7C4B5', flexWrap: 'wrap', gap: 8 },
};
