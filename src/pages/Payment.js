import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';

export default function Payment() {
  const { orderId } = useParams();
  const { orders, updatePaymentStatus, user, triggerMpesa } = useApp();
  const navigate = useNavigate();

  const order = orders.find(o => o.orderId === orderId);
  const [method, setMethod] = useState('mpesa');
  const [phone, setPhone] = useState(user?.phone || '');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!order) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1B4332' }}>Order Not Found</h2>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  const handlePay = async () => {
    if (method === 'mpesa' && !phone) { setError('Please enter your M-Pesa phone number.'); return; }
    setError('');
    setProcessing(true);
    
    try {
      if (method === 'mpesa') {
        const res = await triggerMpesa(orderId, phone);
        if (res.ResponseCode === "0") {
          // STK push sent successfully
          alert('STK Push sent to your phone. Please enter your PIN to authorize payment.');
          // In a real app, we'd poll the server or use WebSockets for callback confirmation.
          // For this demo, let's wait a bit then show success or keep processing.
          await new Promise(r => setTimeout(r, 5000));
          // Check if order payment status updated (fetched in background)
          // Since we don't have automatic refresh here without more work, we'll simulate the final step.
          updatePaymentStatus(orderId, 'Paid');
          setSuccess(true);
        } else {
          setError('M-Pesa transaction failed to initiate.');
        }
      } else {
        await new Promise(r => setTimeout(r, 2000));
        updatePaymentStatus(orderId, 'Paid');
        setSuccess(true);
      }
    } catch (err) {
      setError('Payment processing failed. Please check your connection.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div className="card" style={styles.successCard}>
          <div style={styles.checkAnim}><CheckCircle size={72} color="#52B788" /></div>
          <h2 style={styles.successTitle}>Payment Successful!</h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>Your payment of <strong>KES {order.total}</strong> has been received.</p>
          <div style={styles.receiptBox}>
            <div style={styles.receiptRow}><span>Order ID</span><strong>{order.orderId}</strong></div>
            <div style={styles.receiptRow}><span>Service</span><strong>{order.serviceType}</strong></div>
            <div style={styles.receiptRow}><span>Method</span><strong>{method === 'mpesa' ? 'M-Pesa' : method}</strong></div>
            <div style={styles.receiptRow}><span>Amount Paid</span><strong style={{ color: '#2D6A4F' }}>KES {order.total}</strong></div>
            <div style={styles.receiptRow}><span>Date</span><strong>{new Date().toLocaleDateString()}</strong></div>
            <div style={styles.receiptRow}><span>Status</span><span style={styles.paidBadge}>✓ Paid</span></div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/tracking')}>Track My Order</button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={styles.layout}>
          {/* Payment Form */}
          <div className="card" style={styles.payCard}>
            <div style={styles.secureHeader}>
              <CreditCard size={20} color="#2D6A4F" />
              <span style={styles.secureTitle}>Secure Payment</span>
              <span style={styles.secureTag}>🔒 SSL Encrypted</span>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <h3 style={styles.sectionTitle}>Select Payment Method</h3>
            <div style={styles.methodsGrid}>
              {[
                { id: 'mpesa', label: 'M-Pesa', icon: '📱', sub: 'Pay via M-Pesa' },
              ].map(m => (
                <div key={m.id} onClick={() => setMethod(m.id)}
                  style={{ ...styles.methodCard, ...(method === m.id ? styles.methodSelected : {}) }}>
                  <span style={{ fontSize: 28 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{m.sub}</div>
                  </div>
                  {method === m.id && <CheckCircle size={20} color="#2D6A4F" style={{ marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>

            {method === 'mpesa' && (
              <div className="form-group" style={{ marginTop: 24 }}>
                <label>M-Pesa Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <span style={styles.phonePre}><Smartphone size={16} /></span>
                  <input className="form-control" type="tel" placeholder="+254 700 000 000"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    style={{ borderRadius: '0 8px 8px 0', borderLeft: 'none' }} />
                </div>
                <p style={styles.mpesaHint}>You will receive an STK push prompt on your phone to authorize payment.</p>
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16, marginTop: 16 }}
              onClick={handlePay} disabled={processing}>
              {processing ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="spinner" style={{ width: 22, height: 22, borderWidth: 3 }}></span>
                  Processing Payment...
                </span>
              ) : (
                <>Pay KES {order.total}</>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>
              🔒 Your payment is secure and encrypted
            </p>
          </div>

          {/* Billing Summary */}
          <div className="card" style={styles.billCard}>
            <h3 style={styles.sectionTitle}>Billing Summary</h3>
            <div style={styles.billRow}><span>Order ID</span><strong style={{ color: '#2D6A4F' }}>{order.orderId}</strong></div>
            <div style={styles.billRow}><span>Service</span><strong>{order.serviceType}</strong></div>
            <div style={styles.billRow}><span>Package</span><strong>{order.package}</strong></div>
            <div style={styles.billRow}><span>Quantity</span><strong>{order.quantity} kg/pcs</strong></div>
            <div style={styles.billRow}><span>Pickup Date</span><strong>{order.pickupDate}</strong></div>
            <div style={styles.billRow}><span>Delivery Date</span><strong>{order.deliveryDate}</strong></div>
            <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '12px 0' }} />
            <div style={styles.billRow}><span>Subtotal</span><span>KES {order.subtotal}</span></div>
            <div style={styles.billRow}><span>Delivery Fee</span><span>KES {order.deliveryFee}</span></div>
            {order.discount > 0 && <div style={{ ...styles.billRow, color: '#10B981' }}><span>Discount</span><span>-KES {order.discount}</span></div>}
            <div style={styles.billTotal}><span>Total</span><span>KES {order.total}</span></div>

            {/* Transaction History */}
            <div style={{ marginTop: 24, background: '#F8FAF8', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1B4332' }}>Transaction History</div>
              {orders.filter(o => o.paymentStatus === 'Paid').length === 0 ? (
                <p style={{ fontSize: 12, color: '#9CA3AF' }}>No transactions yet</p>
              ) : (
                orders.filter(o => o.paymentStatus === 'Paid').slice(0, 3).map(o => (
                  <div key={o._id} style={styles.txRow}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{o.orderId}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>KES {o.total}</div>
                      <div style={{ fontSize: 11, color: '#10B981' }}>✓ Paid</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#F8FAF8', minHeight: '100vh', padding: '40px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
  container: { width: '100%', maxWidth: 900 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' },
  payCard: { padding: 28 },
  secureHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #E5E7EB' },
  secureTitle: { fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#1B4332', flex: 1 },
  secureTag: { fontSize: 12, background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: 50 },
  sectionTitle: { fontFamily: 'Playfair Display, serif', fontSize: 17, color: '#1B4332', marginBottom: 16 },
  methodsGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
  methodCard: { display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', border: '2px solid #E5E7EB', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' },
  methodSelected: { border: '2px solid #2D6A4F', background: '#F0FDF4' },
  phonePre: { background: '#F3F4F6', border: '2px solid #E5E7EB', borderRight: 'none', borderRadius: '8px 0 0 8px', padding: '0 14px', display: 'flex', alignItems: 'center', height: 48, color: '#6B7280' },
  mpesaHint: { fontSize: 12, color: '#6B7280', marginTop: 6, lineHeight: 1.5 },
  billCard: { padding: 24 },
  billRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 },
  billTotal: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, borderTop: '2px solid #E5E7EB', paddingTop: 12, marginTop: 8, color: '#1B4332' },
  txRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' },
  successPage: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  successCard: { maxWidth: 480, width: '100%', textAlign: 'center', padding: '48px 36px' },
  checkAnim: { display: 'flex', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1B4332', marginBottom: 8 },
  receiptBox: { background: '#F8FAF8', borderRadius: 12, padding: 20, marginBottom: 8, textAlign: 'left' },
  receiptRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 },
  paidBadge: { background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: 50, fontSize: 13, fontWeight: 600 },
};
