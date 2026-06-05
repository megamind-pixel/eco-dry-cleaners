import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Contact Us</h1>
        <p style={styles.heroSub}>We'd love to hear from you. Send us a message!</p>
      </div>
      <div style={styles.container}>
        <div style={styles.layout}>
          {/* Contact Info */}
          <div>
            <div className="card" style={styles.infoCard}>
              <h2 style={styles.infoTitle}>Our Location</h2>
              <div style={styles.infoItem}><MapPin size={20} color="#2D6A4F" /><div><div style={{ fontWeight: 600 }}>Address</div><div style={styles.infoText}>123 Green Street, Westlands<br />Nairobi, Kenya</div></div></div>
              <div style={styles.infoItem}><Phone size={20} color="#2D6A4F" /><div><div style={{ fontWeight: 600 }}>Phone</div><div style={styles.infoText}>+1 (343) 553-89196</div></div></div>
              <div style={styles.infoItem}><Mail size={20} color="#2D6A4F" /><div><div style={{ fontWeight: 600 }}>Email</div><div style={styles.infoText}>clean@ecodrycleaners.ca</div></div></div>
              <div style={styles.infoItem}><Clock size={20} color="#2D6A4F" /><div><div style={{ fontWeight: 600 }}>Hours</div><div style={styles.infoText}>Mon – Sat: 7:00 AM – 8:00 PM<br />Sun: 9:00 AM – 5:00 PM</div></div></div>
            </div>

            {/* Map placeholder */}
            <div style={styles.mapBox}>
              <div style={styles.mapInner}>
                <MapPin size={40} color="#2D6A4F" />
                <div style={{ fontWeight: 600, color: '#1B4332', marginTop: 8 }}>123 Green Street</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>Ottawa, Ontario</div>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
                  Open in Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h2 style={styles.formTitle}>Send a Message</h2>
            {sent && (
              <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={18} /> Message sent successfully! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Your Name</label>
                  <input className="form-control" placeholder="John Doe" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-control" type="email" placeholder="john@example.com"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input className="form-control" placeholder="How can we help?" value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" rows={6} placeholder="Your message here..."
                  value={form.message} onChange={e => setForm({...form, message: e.target.value})} required
                  style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ padding: '14px 28px', fontSize: 16 }}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }}></span> : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: 'white', padding: '60px 24px', textAlign: 'center' },
  heroTitle: { fontFamily: 'Playfair Display, serif', fontSize: 40, marginBottom: 12 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '48px 24px' },
  layout: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: 32, alignItems: 'start' },
  infoCard: { padding: 28, marginBottom: 24 },
  infoTitle: { fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#1B4332', marginBottom: 20 },
  infoItem: { display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' },
  infoText: { fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginTop: 2 },
  mapBox: { borderRadius: 14, overflow: 'hidden', background: '#D8F3DC', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mapInner: { textAlign: 'center' },
  formTitle: { fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#1B4332', marginBottom: 24 },
};
